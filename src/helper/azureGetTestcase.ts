import { DefaultAzureCredential } from "@azure/identity";
import * as azdev from "azure-devops-node-api";
import { JSDOM } from "jsdom";

/**
 * Interface for test step
 */
interface TestStep {
  step: number;
  action: string;
  expectedResult: string[];
}

/**
 * Interface for test case result
 */
interface TestCaseResult {
  steps: TestStep[];
}

/**
 * Utility to strip all HTML/XML tags from a string
 */
function stripTags(text: string): string {
  const clean = text.replace(/<.*?>/g, '');
  return clean.trim() || 'none';
}

/**
 * Utility to split expected results into a list, removing numbering
 * e.g. '1. First step2. Second step' -> ['First step', 'Second step']
 */
function splitExpected(text: string): string[] {
  // Remove HTML entities if any
  text = text.replace(/&[a-zA-Z0-9#]+;/g, '');
  text = text.trim();
  
  // Find all matches for numbered steps (e.g., '1. ...', '2. ...')
  const matches = text.match(/\d+\.\s*([^\d]+?)(?=(?:\d+\.|$))/g);
  
  if (matches) {
    // Clean up whitespace and filter out empty strings
    const result = matches
      .map(m => m.replace(/^\d+\.\s*/, '').trim())
      .filter(m => m);
    return result.length > 0 ? result : (text ? [text] : ['none']);
  }
  
  return text ? [text] : ['none'];
}

/**
 * Utility to get Azure DevOps test case details as JSON
 */
export async function getStepsFromTestcase(testid: string): Promise<TestCaseResult> {
  // Organization URL for Azure DevOps
  //const organizationUrl = 'https://dev.azure.com/gopimuthu';
  const organizationUrl = 'https://dev.azure.com/hexagonppmcol';

  try {
    // Get an access token using DefaultAzureCredential
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("https://app.vssps.visualstudio.com/.default");
    
    if (!tokenResponse) {
      throw new Error("Failed to get access token");
    }

    // Create connection to Azure DevOps
    const authHandler = azdev.getPersonalAccessTokenHandler(tokenResponse.token);
    const connection = new azdev.WebApi(organizationUrl, authHandler);
    
    // Get the work item tracking client
    const witClient = await connection.getWorkItemTrackingApi();
    
    // Get the work item (test case) from Azure DevOps
    const workItem = await witClient.getWorkItem(parseInt(testid));
    
    const result: TestCaseResult = { steps: [] };
    
    if (workItem && workItem.fields && workItem.fields['Microsoft.VSTS.TCM.Steps']) {
      const stepsHtml = workItem.fields['Microsoft.VSTS.TCM.Steps'] as string;
      
      // Parse the steps HTML and extract step/action/expected
      const dom = new JSDOM(stepsHtml);
      const document = dom.window.document;
      
      // Find all <parameterizedString> tags and extract their text content
      const parameterizedElements = document.querySelectorAll('parameterizedstring');
      const paramStrings: string[] = [];
      
      for (let i = 0; i < parameterizedElements.length; i++) {
        const element = parameterizedElements[i];
        paramStrings.push(element.textContent?.trim() || '');
      }
      
      // Remove any remaining HTML/XML tags from each string
      const cleanParamStrings = paramStrings.map(s => stripTags(s));
      
      let stepNumber = 1;
      
      // Iterate through the cleaned strings in pairs: even index is action, odd index is expected result
      for (let i = 0; i < cleanParamStrings.length; i += 2) {
        const action = cleanParamStrings[i] || '';
        // If there is no expected result for the last action, use 'none'
        const expectedRaw = cleanParamStrings[i + 1] || 'none';
        // Use splitExpected to further process the expected result
        const expected = splitExpected(expectedRaw);
        
        // Add the parsed step to the result list
        result.steps.push({
          step: stepNumber,
          action: action,
          expectedResult: expected
        });
        stepNumber++;
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`Authentication or API call failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

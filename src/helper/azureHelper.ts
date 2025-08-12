/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

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
 * Interface for automation details from work item
 */
export interface AutomationDetails {
  automatedTestId?: string;
  automatedTestName?: string;
  automatedTestStorage?: string;
  automatedTestType?: string;
  automationStatus?: string;
  automationStatusCustom?: string;
}

export async function getAutomationDetailsFromWorkItem(workItemId: string): Promise<AutomationDetails> {
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
    
    // Get the work item from Azure DevOps
    const workItem = await witClient.getWorkItem(parseInt(workItemId));
    
    const automationDetails: AutomationDetails = {};
    
    if (workItem && workItem.fields) {
      // Extract automation-related fields from the work item
      // These field names are based on standard Azure DevOps Test Case fields
      automationDetails.automatedTestId = workItem.fields['Microsoft.VSTS.TCM.AutomatedTestId'] as string;
      automationDetails.automatedTestName = workItem.fields['Microsoft.VSTS.TCM.AutomatedTestName'] as string;
      automationDetails.automatedTestStorage = workItem.fields['Microsoft.VSTS.TCM.AutomatedTestStorage'] as string;
      automationDetails.automatedTestType = workItem.fields['Microsoft.VSTS.TCM.AutomatedTestType'] as string;
      automationDetails.automationStatus = workItem.fields['Microsoft.VSTS.TCM.AutomationStatus'] as string;
      automationDetails.automationStatusCustom = workItem.fields['Custom.AutomationStatus'] as string;
    }
    
    return automationDetails;
  } catch (error) {
    throw new Error(`Failed to get automation details from work item: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Utility to update automation details for Azure DevOps work item
 */
export async function updateAutomationDetailsInWorkItem(
  workItemId: string, 
  updates: AutomationDetails
): Promise<boolean> {
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
    
    // Build the patch document with field updates
    const patchDocument: any[] = [];
    
    if (updates.automatedTestId !== undefined) {
      patchDocument.push({
        op: "replace",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestId",
        value: updates.automatedTestId
      });
    }
    
    if (updates.automatedTestName !== undefined) {
      patchDocument.push({
        op: "replace",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestName",
        value: updates.automatedTestName
      });
    }
    
    if (updates.automatedTestStorage !== undefined) {
      patchDocument.push({
        op: "replace",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestStorage",
        value: updates.automatedTestStorage
      });
    }
    
    if (updates.automatedTestType !== undefined) {
      patchDocument.push({
        op: "replace",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestType",
        value: updates.automatedTestType
      });
    }
    
    if (updates.automationStatus !== undefined) {
      patchDocument.push({
        op: "replace",
        path: "/fields/Microsoft.VSTS.TCM.AutomationStatus",
        value: updates.automationStatus
      });
    }
    
    if (updates.automationStatusCustom !== undefined) {
      patchDocument.push({
        op: "replace",
        path: "/fields/Custom.AutomationStatus",
        value: updates.automationStatusCustom
      });
    }
    
    // Only proceed if there are actual updates to make
    if (patchDocument.length === 0) {
      throw new Error("No updates provided");
    }
    
    // Update the work item
    const updatedWorkItem = await witClient.updateWorkItem(
      undefined, // customHeaders
      patchDocument,
      parseInt(workItemId)
    );
    
    return updatedWorkItem !== null && updatedWorkItem !== undefined;
  } catch (error) {
    throw new Error(`Failed to update automation details in work item: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Utility to clear automation details from Azure DevOps work item
 */
export async function clearAutomationDetailsInWorkItem(workItemId: string): Promise<boolean> {
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
    
    // Build the patch document to clear all automation fields
    const patchDocument: any[] = [
      {
        op: "remove",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestId"
      },
      {
        op: "remove",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestName"
      },
      {
        op: "remove",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestStorage"
      },
      {
        op: "remove",
        path: "/fields/Microsoft.VSTS.TCM.AutomatedTestType"
      },
      {
        op: "replace",
        path: "/fields/Microsoft.VSTS.TCM.AutomationStatus",
        value: "Not Automated"
      },
      {
        op: "remove",
        path: "/fields/Custom.AutomationStatus"
      }
    ];
    
    // Update the work item
    const updatedWorkItem = await witClient.updateWorkItem(
      undefined, // customHeaders
      patchDocument,
      parseInt(workItemId)
    );
    
    return updatedWorkItem !== null && updatedWorkItem !== undefined;
  } catch (error) {
    throw new Error(`Failed to clear automation details from work item: ${error instanceof Error ? error.message : String(error)}`);
  }
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

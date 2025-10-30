/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

import { DefaultAzureCredential } from "@azure/identity";

/**
 * Interface for PR file change
 */
export interface PRFileChange {
  changeType: string;
  item: {
    path: string;
    url: string;
  };
  sourceServerItem?: string;
  originalPath?: string;
}




/**
 * Interface for PR file change
 */
export interface PRFileChange {
  changeType: string;
  item: {
    path: string;
    url: string;
  };
  sourceServerItem?: string;
  originalPath?: string;
}

/**
 * Interface for PR iteration result
 */
export interface PRIterationResult {
  iterationId: number;
  changes: PRFileChange[];
}

/**
 * Utility to get the latest iteration ID for a pull request
 */
export async function getPRLatestIterationId(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number
): Promise<number> {
  try {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("https://app.vssps.visualstudio.com/.default");
    
    if (!tokenResponse) {
      throw new Error("Failed to get access token");
    }

    // Construct the REST API URL directly
    const apiUrl = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/iterations?api-version=7.0`;
    
    // Make direct REST API call
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenResponse.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as any;
    const iterations = data.value;
    
    if (!iterations || iterations.length === 0) {
      throw new Error('No iterations found for this pull request');
    }

    // Return the highest iteration ID (latest iteration)
    const latestIteration = iterations.reduce((latest: any, current: any) => 
      (current.id && latest.id && current.id > latest.id) ? current : latest
    );

    if (!latestIteration.id) {
      throw new Error('Could not determine latest iteration ID');
    }

    return latestIteration.id;
  } catch (error) {
    throw new Error(`Failed to get latest iteration ID: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Utility to get file changes for a specific PR iteration
 */
export async function getPRIterationChanges(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number,
  iterationId: number
): Promise<PRIterationResult> {
  try {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("https://app.vssps.visualstudio.com/.default");
    
    if (!tokenResponse) {
      throw new Error("Failed to get access token");
    }

    // Construct the REST API URL directly
    const apiUrl = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/iterations/${iterationId}/changes?api-version=7.0`;
    
    // Make direct REST API call
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenResponse.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as any;
    const changes = data;
    
    if (!changes || !changes.changeEntries) {
      return { iterationId, changes: [] };
    }

    // Map the changes to our interface
    const mappedChanges: PRFileChange[] = changes.changeEntries.map((change: any) => ({
      changeType: change.changeType?.toString() || 'unknown',
      item: {
        path: change.item?.path || '',
        url: change.item?.url || ''
      },
      sourceServerItem: change.sourceServerItem,
      originalPath: change.originalPath
    }));

    return {
      iterationId,
      changes: mappedChanges
    };
  } catch (error) {
    throw new Error(`Failed to get iteration changes: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Utility to get file changes from the latest iteration of a pull request
 */
export async function getPRFileChanges(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number
): Promise<PRIterationResult> {
  try {
    // First get the latest iteration ID
    const latestIterationId = await getPRLatestIterationId(
      organization,
      project,
      repositoryId,
      pullRequestId
    );

    // Then get the changes for that iteration
    return await getPRIterationChanges(
      organization,
      project,
      repositoryId,
      pullRequestId,
      latestIterationId
    );
  } catch (error) {
    throw new Error(`Failed to get PR file changes: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Interface for PR comment thread position
 */
export interface PRCommentThreadPosition {
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}

/**
 * Interface for PR comment thread
 */
export interface PRCommentThread {
  id?: number;
  publishedDate?: string;
  lastUpdatedDate?: string;
  comments?: any[];
  status?: string;
  threadContext?: {
    filePath: string;
    rightFileStart?: PRCommentThreadPosition;
    rightFileEnd?: PRCommentThreadPosition;
  };
}

/**
 * Utility to add an inline comment to a pull request in Azure DevOps
 */
export async function addPRInlineComment(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number,
  filePath: string,
  lineNumber: number,
  commentText: string
): Promise<PRCommentThread> {
  try {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("https://app.vssps.visualstudio.com/.default");
    
    if (!tokenResponse) {
      throw new Error("Failed to get access token");
    }

    // Construct the REST API URL for creating PR comment threads
    const apiUrl = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/threads?api-version=7.0`;
    
    // Prepare the comment thread payload
    const threadPayload = {
      comments: [
        {
          commentType: "text",
          content: commentText
        }
      ],
      status: "active",
      threadContext: {
        filePath: filePath,
        rightFileStart: {
          line: lineNumber,
          offset: 1
        },
        rightFileEnd: {
          line: lineNumber,
          offset: 1
        }
      }
    };

    // Make direct REST API call to create comment thread
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenResponse.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(threadPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const createdThread = await response.json() as any;
    
    return {
      id: createdThread.id,
      publishedDate: createdThread.publishedDate,
      lastUpdatedDate: createdThread.lastUpdatedDate,
      comments: createdThread.comments,
      status: createdThread.status,
      threadContext: createdThread.threadContext
    };
  } catch (error) {
    throw new Error(`Failed to add PR inline comment: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Utility to get all comment threads for a pull request
 */
export async function getPRCommentThreads(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number
): Promise<PRCommentThread[]> {
  try {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("https://app.vssps.visualstudio.com/.default");
    
    if (!tokenResponse) {
      throw new Error("Failed to get access token");
    }

    // Construct the REST API URL for getting PR comment threads
    const apiUrl = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/threads?api-version=7.0`;
    
    // Make direct REST API call
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenResponse.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as any;
    const threads = data.value || [];
    
    return threads.map((thread: any) => ({
      id: thread.id,
      publishedDate: thread.publishedDate,
      lastUpdatedDate: thread.lastUpdatedDate,
      comments: thread.comments,
      status: thread.status,
      threadContext: thread.threadContext
    }));
  } catch (error) {
    throw new Error(`Failed to get PR comment threads: ${error instanceof Error ? error.message : String(error)}`);
  }
}



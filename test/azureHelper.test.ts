/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { getAutomationDetailsFromWorkItem, AutomationDetails } from '../src/helper/azureHelper';

// Note: These tests require proper Azure DevOps authentication and access
// You may need to set up environment variables or mock the Azure DevOps client for CI/CD

describe('getAutomationDetailsFromWorkItem', () => {
  // Test with a known work item ID - replace with an actual test case ID from your Azure DevOps
  const TEST_WORK_ITEM_ID = '3780394'; // Replace with actual work item ID for testing

  it('should return automation details for a valid work item', async () => {
    // This test requires a real Azure DevOps connection
    // You may want to skip this in CI/CD and only run locally
    const result = await getAutomationDetailsFromWorkItem(TEST_WORK_ITEM_ID);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    
    // Check that the result has the expected structure
    expect(result).toHaveProperty('automatedTestId');
    expect(result).toHaveProperty('automatedTestName');
    expect(result).toHaveProperty('automatedTestStorage');
    expect(result).toHaveProperty('automatedTestType');
    expect(result).toHaveProperty('automationStatus');
  }, 30000); // 30 second timeout for API calls
  
});

// Simple unit test for the interface structure
describe('AutomationDetails interface', () => {
  it('should accept valid automation details object', () => {
    const validAutomationDetails: AutomationDetails = {
      automatedTestId: 'test123',
      automatedTestName: 'Sample Test',
      automatedTestStorage: 'TestStorage.dll',
      automatedTestType: 'Unit Test',
      automationStatus: 'Automated',
    };
    
    expect(validAutomationDetails.automatedTestId).toBe('test123');
    expect(validAutomationDetails.automatedTestName).toBe('Sample Test');
  });

  it('should accept empty automation details object', () => {
    const emptyAutomationDetails: AutomationDetails = {};
    
    expect(emptyAutomationDetails).toBeDefined();
    expect(Object.keys(emptyAutomationDetails)).toHaveLength(0);
  });
});

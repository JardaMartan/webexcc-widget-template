import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Desktop } from '@wxcc-desktop/sdk';
import { sendWebhook } from './api';

const widgetSlice = createSlice({
  name: 'widget',
  initialState: {
    agentName: 'Agent',
    agent: null,
    status: '',
    statusType: '',
    isLoading: false,
    desktopSDK: null,
    // TODO: Add your custom state properties here
    // Example:
    // selectedOption: null,
    // customData: [],
    // isFetchingData: false
  },
  reducers: {
    setAgentName: (state, action) => {
      state.agentName = action.payload;
    },
    setAgent: (state, action) => {
      state.agent = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload.message;
      state.statusType = action.payload.type;
    },
    clearStatus: (state) => {
      state.status = '';
      state.statusType = '';
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setDesktopSDK: (state, action) => {
      state.desktopSDK = action.payload;
    },
    // TODO: Add your custom reducers here
    // Example:
    // setSelectedOption: (state, action) => {
    //   state.selectedOption = action.payload;
    // },
    // setCustomData: (state, action) => {
    //   state.customData = action.payload;
    // },
    // setFetchingData: (state, action) => {
    //   state.isFetchingData = action.payload;
    // }
  }
});

export const { 
  setAgentName, 
  setAgent,
  setStatus, 
  clearStatus, 
  setLoading, 
  setDesktopSDK,
  // TODO: Export your custom actions here
  // Example:
  // setSelectedOption,
  // setCustomData,
  // setFetchingData
} = widgetSlice.actions;

// Initialize Desktop SDK and set up agent data
export const initializeDesktopSDK = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Desktop SDK is available in Contact Center Desktop environment
    // Agent data will come from widget's agent property
    try {
      console.log('Checking for Desktop SDK availability...');
      Desktop.config.init();
      
      if (typeof Desktop !== 'undefined' && Desktop.agentContact) {
        console.log('Desktop SDK detected');
        
        // Store Desktop SDK reference for later use
        dispatch(setDesktopSDK(Desktop));
        
        // Subscribe to agent state changes if available
        if (Desktop.agentStateInfo?.onAgentStateChange) {
          Desktop.agentStateInfo.onAgentStateChange((state) => {
            console.log('Agent state changed:', state);
          });
        }
        
        dispatch(setStatus({ message: 'status.sdk.init.success', type: 'success' }));
        setTimeout(() => dispatch(clearStatus()), 3000);
      } else {
        throw new Error('Desktop SDK not available in this environment');
      }
    } catch (sdkError) {
      // SDK not available - use demo mode for development/testing
      console.log('Desktop SDK not available, using demo mode');
      
      const mockAgent = {
        name: 'Demo Agent',
        id: 'demo-001',
        state: 'Available',
        agentDbId: 'demo-001',
        agentProfileId: 'demo-profile-001',
        agentEmailId: 'demo.agent@example.com',
        agentName: 'Demo Agent'
      };
      dispatch(setAgent(mockAgent));
      dispatch(setAgentName(mockAgent.name));
      dispatch(setStatus({ message: 'status.sdk.demo', type: 'info' }));
      
      setTimeout(() => {
        dispatch(clearStatus());
      }, 3000);
    }
  } catch (error) {
    console.error('Unexpected error during SDK initialization:', error);
    dispatch(setStatus({ message: 'status.sdk.initFail', type: 'error' }));
  } finally {
    dispatch(setLoading(false));
  }
};

// TODO: Add your custom async thunks here
// Example:
// /**
//  * Fetch custom data using Desktop SDK or API
//  * @returns {Function} Redux thunk function
//  */
// export const fetchCustomData = () => async (dispatch, getState) => {
//   try {
//     dispatch(setFetchingData(true));
//     const { desktopSDK } = getState().widget;
//     
//     if (!desktopSDK) {
//       dispatch(setStatus({ message: 'status.sdk.unavailable', type: 'error' }));
//       setTimeout(() => dispatch(clearStatus()), 3000);
//       return;
//     }
//     
//     // Perform your custom SDK operation here
//     const response = await desktopSDK.someMethod();
//     dispatch(setCustomData(response.data));
//     dispatch(setStatus({ message: 'status.data.fetched', type: 'success' }));
//     setTimeout(() => dispatch(clearStatus()), 3000);
//   } catch (error) {
//     console.error('Failed to fetch custom data:', error);
//     dispatch(setStatus({ message: 'status.data.fail', type: 'error' }));
//     setTimeout(() => dispatch(clearStatus()), 3000);
//   } finally {
//     dispatch(setFetchingData(false));
//   }
// };

// /**
//  * Execute custom action using Desktop SDK
//  * @param {object} data - Data for the custom action
//  * @returns {Function} Redux thunk function
//  */
// export const executeCustomAction = (data) => async (dispatch, getState) => {
//   try {
//     const { desktopSDK } = getState().widget;
//     
//     if (!desktopSDK) {
//       dispatch(setStatus({ message: 'status.demo', type: 'info' }));
//       setTimeout(() => dispatch(clearStatus()), 3000);
//       return;
//     }
//     
//     // Perform your custom action here
//     await desktopSDK.customAction(data);
//     dispatch(setStatus({ message: 'status.action.success', type: 'success' }));
//     setTimeout(() => dispatch(clearStatus()), 3000);
//   } catch (error) {
//     console.error('Custom action failed:', error);
//     dispatch(setStatus({ message: 'status.action.fail', type: 'error' }));
//     setTimeout(() => dispatch(clearStatus()), 3000);
//   }
// };

export const store = configureStore({
  reducer: {
    widget: widgetSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['widget/setDesktopSDK'],
        ignoredActionsPaths: ['payload.desktopSDK'],
        ignoredPaths: ['widget.desktopSDK']
      }
    })
});

export default store;
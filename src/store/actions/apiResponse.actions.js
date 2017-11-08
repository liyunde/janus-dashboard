import {
    OPEN_RESPONSE_MODAL,
    CLOSE_RESPONSE_MODAL,
    OPEN_CONFIRMATION_MODAL,
    CLOSE_CONFIRMATION_MODAL,
    CLEAR_CONFIRMATION_MODAL,
    OPEN_TOASTER,
    CLOSE_TOASTER,
} from '../constants';

import {
    confirmedSaveEndpoint,
    confirmedUpdateEndpoint,
    confirmedDeleteEndpoint,
} from './api.actions';
import {
    confirmedSaveOAuthServer,
    confirmedDeleteOAuthServer,
} from './oAuthServer.actions';

export const openResponseModal = data => ({
    type: OPEN_RESPONSE_MODAL,
    payload: data,
});

export const closeResponseModal = () => ({
    type: CLOSE_RESPONSE_MODAL,
});

export const openConfirmationModal = (action, api, apiName) => {
    const createConfirmationContent = action => {
        switch (action) {
            case 'save':
            case 'saveOAuthServer': {
                return {
                    api,
                    apiName,
                    message: 'Are you sure you want to save?',
                    status: action,
                    title: 'Save',
                };
            }
            case 'update': {
                return {
                    api,
                    apiName,
                    message: 'Are you sure you want to update?',
                    status: action,
                    title: 'Update',
                };
            }
            case 'delete':
            case 'deleteOAuthServer': {
                return {
                    message: 'Are you sure you want to delete? This can\'t be undone',
                    status: action,
                    title: `Delete ${apiName ? apiName + '?' : ''}`,
                    apiName,
                };
            }
            default:
                return false;
        }
    };

    return {
        type: OPEN_CONFIRMATION_MODAL,
        payload: createConfirmationContent(action),
    };
};

export const closeConfirmationModal = () => ({
    type: CLOSE_CONFIRMATION_MODAL,
});

export const clearConfirmationModal = () => ({
    type: CLEAR_CONFIRMATION_MODAL,
});

export const showToaster = () => ({
    type: OPEN_TOASTER,
});

export const closeToaster = () => ({
    type: CLOSE_TOASTER,
});

export const afterCloseConfirmationModal = (status, api, apiName) => (dispatch, getState) => {
    console.error('STATUS', status);
    switch (status) {
        case 'save': {
            return confirmedSaveEndpoint(dispatch, api);
        }
        case 'saveOAuthServer': {
            return confirmedSaveOAuthServer(dispatch, api);
        }
        case 'update': {
            return confirmedUpdateEndpoint(dispatch, api);
        }
        case 'delete': {
            return confirmedDeleteEndpoint(dispatch, apiName);
        }
        case 'deleteOAuthServer': {
            return confirmedDeleteOAuthServer(dispatch, apiName);
        }
        default:
            return false;
    }
};

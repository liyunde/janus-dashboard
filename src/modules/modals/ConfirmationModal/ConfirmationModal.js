import React from 'react'
import {
  func,
  object,
  string
} from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  ___saveEndpoint,
  ___deleteEndpoint,
  ___saveOAuthServer,
  ___deleteOAuthServer,
  ___closeConfirmation
} from '../../../store/actions'

import Modal from '../../../components/Modal/Modal'
import Button from '../../../components/Button/Button'

const propTypes = {
  closeModal: func.isRequired,
  objectType: string,
  objectEntity: object
}

const defaultProps = {
  isOpen: false,
  objectEntity: {}
}

const ActionsMap = {
  save: {
    'endpoint': {
      title: 'Save endpoint',
      message: 'Are you sure you want to save endpoint?',
      onConfirm: ___saveEndpoint({
        isEditing: false
      })
    },
    'OAuthServer': {
      title: 'Save OAuthServer',
      message: 'Are you sure you want to save OAuth server?',
      onConfirm: ___saveOAuthServer({
        isEditing: false
      })
    }
  },
  update: {
    'endpoint': {
      title: 'Update endpoint',
      message: 'Are you sure you want to update endpoint?',
      onConfirm: ___saveEndpoint({
        isEditing: true
      })
    },
    'OAuthServer': {
      title: 'Update OAuthServer title',
      message: 'Are you sure you want to update OAuth server?',
      onConfirm: ___saveOAuthServer({
        isEditing: true
      })
    }
  },
  delete: {
    'endpoint': {
      title: 'Delete endpoint',
      message: 'Are you sure you want to delete the endpoint?',
      onConfirm: ___deleteEndpoint
    },
    'OAuthServer': {
      title: 'Delete endpoint title',
      message: 'Are you sure you want to delete the OAuth server?',
      onConfirm: ___deleteOAuthServer
    }
  }
}

const ConfirmationModal = ({
  dispatch,
  isOpen,
  actionType,
  closeModal,
  objectEntity,
  objectType,
  configurationMetadata,
  backup
}) => {
  // eslint-disable-next-line no-mixed-operators
  const getValue = target => isOpen && ActionsMap[actionType][objectType][target] || ''
  const onConfirm = getValue('onConfirm')
  const handleCloseModal = () => closeModal()

  return (
    <Modal
      show={isOpen}
      closeModal={handleCloseModal}
      message={
        React.isValidElement(getValue('message'))
          ? React.cloneElement(getValue('message'), { objectEntity })
          : getValue('message')
      }
      title={getValue('title')}
      buttons={[
        <Button key='cancel' mod='default' onClick={handleCloseModal}>Cancel</Button>,
        <Button
          key='ok'
          mod='primary'
          onClick={
            () => dispatch(onConfirm(objectEntity))
          }
        >
                    OK
        </Button>
      ]}
    />
  )
}

ConfirmationModal.propTypes = propTypes
ConfirmationModal.defaultProps = defaultProps

const mapStateToProps = state => {
  const {
    actionType,
    isOpen,
    objectEntity,
    objectType
  } = state.confirmationReducer

  return {
    actionType,
    objectEntity,
    objectType,
    isOpen
    // configurationMetadata: state.configurationReducer.configurationDifference,
    // backup: state.configurationReducer.backup
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    closeModal: bindActionCreators(___closeConfirmation, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationModal)

/*
const ____ActionsMap = {
    save: {
      configuration: {
        title: 'Save configuration',
        message: 'Are you sure you want to save configuration?',
        onConfirm: saveConfiguration({
          isEditing: false
        })
      },
      project: {
        title: 'Save project',
        message: 'Are you sure you want to save project?',
        onConfirm: saveProject
      },
      locale: {
        title: 'Save locale',
        message: 'Are you sure you want to save locale?',
        onConfirm: saveLocale({
          isEditing: false
        })
      }
    },
    update: {
      configuration: {
        title: 'Save configuration',
        message: 'Are you sure you want to save configuration?',
        onConfirm: saveConfiguration({
          isEditing: true
        })
      },
      locale: {
        title: 'Save locale',
        message: 'Are you sure you want to save locale?',
        onConfirm: saveLocale({
          isEditing: true
        })
      }
    },
    delete: {
      configuration: {
        title: 'Delete configuration',
        message: <DeleteConfigurationModalContent />,
        onConfirm: deleteConfiguration
      },
      project: {
        title: 'Delete project',
        message: <DeleteProjectModalContent />,
        onConfirm: deleteProject
      },
      locale: {
        title: 'Delete country-locale',
        message: <DeleteLocaleModalContent />,
        onConfirm: deleteLocale
      }
    },
    preview: {
      auditlog: {
        title: 'Audit log details',
        message: <PreviewModalContent />,
        onConfirm: closeConfirmation
      }
    },
    rollback: {
      auditlog: {
        title: 'Rollback audit log',
        message: <RollbackModalContent />,
        onConfirm: rollbackAuditLog
      }
    },
    error: {
      error: {
        title: 'Error',
        message: <ErrorContent />,
        onConfirm: closeConfirmation
      }
    },
    conflict: {
      configuration: {
        title: 'Conflict detected',
        message: <ConflictsPreviewContainer />,
        onConfirm: closeConfirmation
      }
    }
  }
  */

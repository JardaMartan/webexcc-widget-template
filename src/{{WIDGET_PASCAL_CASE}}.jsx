import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Select,
  SelectOption,
  Loading,
  Label,
  Button
} from '@momentum-ui/react';
import '../public/css/momentum-ui-local-corrected.min.css';
import { 
  initializeDesktopSDK,
  setAgent,
  // TODO: Add your custom actions here
  // Example: setCustomData, executeCustomAction
} from './store';
import { useI18n } from './i18n';

const {{WIDGET_PASCAL_CASE}} = ({ 
  darkmode, 
  accesstoken, 
  task, 
  selectedtaskid, 
  cad, 
  details, 
  wrap, 
  avatar, 
  name, 
  orgid, 
  datacenter, 
  agent
}) => {
  const dispatch = useDispatch();
  const { 
    isLoading, 
    agent: storeAgent,
    // TODO: Add your custom state properties here
    // Example: customData, selectedOption
  } = useSelector(state => state.widget);

  const [notes, setNotes] = useState('');
  const { t } = useI18n();

  // TODO: Add your custom options/data here
  // Example:
  // const customOptions = useMemo(() => [
  //   { value: 'option1', label: t('ui.option1') },
  //   { value: 'option2', label: t('ui.option2') }
  // ], [t]);

  useEffect(() => {
    dispatch(initializeDesktopSDK());
  }, [dispatch]);

  useEffect(() => {
    console.log('{{WIDGET_PASCAL_CASE}}: Props received:', { 
      darkmode, 
      accesstoken, 
      task, 
      selectedtaskid, 
      cad, 
      details, 
      wrap, 
      avatar, 
      name, 
      orgid, 
      datacenter, 
      agent
    });
  }, [darkmode, accesstoken, task, selectedtaskid, cad, details, wrap, avatar, name, orgid, datacenter, agent]);

  // Sync Redux store agent with incoming agent prop
  useEffect(() => {
    if (agent) {
      const propId = agent.agentDbId || agent.id;
      const storeId = storeAgent && (storeAgent.agentDbId || storeAgent.id);
      if (!storeAgent || propId !== storeId) {
        console.log('Syncing agent prop to Redux store', { propId, storeId });
        dispatch(setAgent(agent));
      }
    }
  }, [agent, storeAgent, dispatch]);

  // TODO: Add your custom useEffect hooks here
  // Example:
  // useEffect(() => {
  //   if (someCondition) {
  //     dispatch(fetchCustomData());
  //   }
  // }, [someCondition, dispatch]);

  // Handle Accept action
  const handleAccept = useCallback(() => {
    console.log('Accept button clicked', { selectedtaskid, notes });
    // TODO: Add your custom Accept logic here
    // Example: dispatch(acceptTask(task, notes));
  }, [selectedtaskid, notes]);

  // Handle Reject action
  const handleReject = useCallback(() => {
    console.log('Reject button clicked', { selectedtaskid, notes });
    // TODO: Add your custom Reject logic here
    // Example: dispatch(rejectTask(task, notes));
  }, [selectedtaskid, notes]);

  // TODO: Add your custom handlers here
  // Example:
  // const handleCustomAction = useCallback(() => {
  //   dispatch(executeCustomAction(customData));
  // }, [dispatch, customData]);

  /**
   * Truncate text for display purposes
   * @param {*} text - Text to truncate (any type)
   * @param {number} maxLength - Maximum length before truncation (default: 50)
   * @returns {string} Truncated text with ellipsis or 'not set'
   */
  const truncateText = (text, maxLength = 50) => {
    if (!text) return t('ui.value.notSet');
    const textString = typeof text === 'object' ? JSON.stringify(text) : String(text);
    return textString.length > maxLength ? textString.substring(0, maxLength) + '...' : textString;
  };

  const loadingView = (
    <div style={{ padding: '20px' }}>
      <Loading />
      <p>{t('ui.loading')}</p>
    </div>
  );

  if (isLoading) return loadingView;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ width: '100%' }}>
        <h2>{t('ui.widget.title')}</h2>
        <p>{t('ui.widget.description')}</p>

        {/* Notes input field */}
        <div style={{ marginTop: '20px' }}>
          <Label htmlFor="notes-field">{t('ui.notes.label')}</Label>
          <textarea
            id="notes-field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '14px', 
              fontFamily: 'inherit',
              border: '1px solid #ccc',
              borderRadius: '6px',
              resize: 'vertical',
              boxSizing: 'border-box',
              minHeight: '100px'
            }}
            placeholder={t('ui.notes.placeholder')}
          />
        </div>

        {/* Accept and Reject buttons */}
        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          gap: '16px',
          justifyContent: 'center'
        }}>
          <Button
            color="green"
            size="large"
            onClick={handleAccept}
            ariaLabel="Accept task"
            style={{ minWidth: '120px' }}
          >
            {t('ui.accept')}
          </Button>
          <Button
            color="red"
            size="large"
            onClick={handleReject}
            ariaLabel="Reject task"
            style={{ minWidth: '120px' }}
          >
            {t('ui.reject')}
          </Button>
        </div>

        {/* Debug properties display */}
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <div><strong>{t('ui.props.header')}</strong></div>
          <div>{t('ui.props.darkmode')}: {darkmode || t('ui.value.notSet')}</div>
          <div>{t('ui.props.accessToken')}: {accesstoken ? '***' + accesstoken.slice(-4) : t('ui.value.notSet')}</div>
          <div>{t('ui.props.name')}: {name || t('ui.value.notSet')}</div>
          <div>{t('ui.props.avatar')}: {avatar || t('ui.value.notSet')}</div>
          <div>{t('ui.props.orgId')}: {orgid || t('ui.value.notSet')}</div>
          <div>{t('ui.props.dataCenter')}: {datacenter || t('ui.value.notSet')}</div>
          <div>{t('ui.props.selectedTaskId')}: {selectedtaskid || t('ui.value.notSet')}</div>
          <div>{t('ui.props.task')}: {truncateText(task)}</div>
          <div>{t('ui.props.agent')}: {truncateText(agent)}</div>
          <div>{t('ui.props.cad')}: {truncateText(cad)}</div>
          <div>{t('ui.props.details')}: {truncateText(details)}</div>
          <div>{t('ui.props.wrap')}: {truncateText(wrap)}</div>
        </div>
      </div>
    </div>
  );
};

{{WIDGET_PASCAL_CASE}}.propTypes = {
  darkmode: PropTypes.string,
  accesstoken: PropTypes.string,
  task: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selectedtaskid: PropTypes.string,
  cad: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  details: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  wrap: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  avatar: PropTypes.string,
  name: PropTypes.string,
  orgid: PropTypes.string,
  datacenter: PropTypes.string,
  agent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

{{WIDGET_PASCAL_CASE}}.defaultProps = {
  darkmode: null,
  accesstoken: null,
  task: null,
  selectedtaskid: null,
  cad: null,
  details: null,
  wrap: null,
  avatar: null,
  name: null,
  orgid: null,
  datacenter: null,
  agent: null,
};

export default {{WIDGET_PASCAL_CASE}};
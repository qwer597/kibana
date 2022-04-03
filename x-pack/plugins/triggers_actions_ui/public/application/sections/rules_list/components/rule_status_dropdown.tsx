/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { i18n } from '@kbn/i18n';
import {
  useGeneratedHtmlId,
  EuiLoadingSpinner,
  EuiPopover,
  EuiContextMenu,
  EuiBadge,
  EuiPanel,
  EuiFieldNumber,
  EuiSelect,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiHorizontalRule,
  EuiTitle,
  EuiFlexGrid,
  EuiSpacer,
  EuiLink,
  EuiText,
  EuiToolTip,
} from '@elastic/eui';
import { parseInterval } from '../../../../../common';

import { RuleTableItem } from '../../../../types';

type SnoozeUnit = 'm' | 'h' | 'd' | 'w' | 'M';
const SNOOZE_END_TIME_FORMAT = 'LL @ LT';

export interface ComponentOpts {
  item: RuleTableItem;
  onRuleChanged: () => void;
  enableRule: () => Promise<void>;
  disableRule: () => Promise<void>;
  snoozeRule: (snoozeEndTime: string | -1) => Promise<void>;
  unsnoozeRule: () => Promise<void>;
  isEditable: boolean;
}

export const RuleStatusDropdown: React.FunctionComponent<ComponentOpts> = ({
  item,
  onRuleChanged,
  disableRule,
  enableRule,
  snoozeRule,
  unsnoozeRule,
  isEditable,
}: ComponentOpts) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(item.enabled);
  const [isSnoozed, setIsSnoozed] = useState<boolean>(isItemSnoozed(item));
  useEffect(() => {
    setIsEnabled(item.enabled);
  }, [item.enabled]);
  useEffect(() => {
    setIsSnoozed(isItemSnoozed(item));
  }, [item]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const onClickBadge = useCallback(() => setIsPopoverOpen((isOpen) => !isOpen), [setIsPopoverOpen]);
  const onClosePopover = useCallback(() => setIsPopoverOpen(false), [setIsPopoverOpen]);

  const onChangeEnabledStatus = useCallback(
    async (enable: boolean) => {
      setIsUpdating(true);
      if (enable) {
        await enableRule();
      } else {
        await disableRule();
      }
      setIsEnabled(!isEnabled);
      onRuleChanged();
      setIsUpdating(false);
    },
    [setIsUpdating, isEnabled, setIsEnabled, onRuleChanged, enableRule, disableRule]
  );
  const onChangeSnooze = useCallback(
    async (value: number, unit?: SnoozeUnit) => {
      setIsUpdating(true);
      if (value === -1) {
        await snoozeRule(-1);
      } else if (value !== 0) {
        const snoozeEndTime = moment().add(value, unit).toISOString();
        await snoozeRule(snoozeEndTime);
      } else await unsnoozeRule();
      setIsSnoozed(value !== 0);
      onRuleChanged();
      setIsUpdating(false);
    },
    [setIsUpdating, setIsSnoozed, onRuleChanged, snoozeRule, unsnoozeRule]
  );

  const badgeColor = !isEnabled ? 'default' : isSnoozed ? 'warning' : 'primary';
  const badgeMessage = !isEnabled ? DISABLED : isSnoozed ? SNOOZED : ENABLED;

  const remainingSnoozeTime =
    isEnabled && isSnoozed ? (
      <EuiToolTip content={moment(item.snoozeEndTime).format(SNOOZE_END_TIME_FORMAT)}>
        <EuiText color="subdued" size="xs">
          {item.muteAll ? INDEFINITELY : moment(item.snoozeEndTime).fromNow(true)}
        </EuiText>
      </EuiToolTip>
    ) : null;

  const nonEditableBadge = (
    <EuiBadge color={badgeColor} data-test-subj="statusDropdownReadonly">
      {badgeMessage}
    </EuiBadge>
  );

  const editableBadge = (
    <EuiBadge
      color={badgeColor}
      iconSide="right"
      iconType={!isUpdating && isEditable ? 'arrowDown' : undefined}
      onClick={onClickBadge}
      iconOnClick={onClickBadge}
      onClickAriaLabel={OPEN_MENU_ARIA_LABEL}
      iconOnClickAriaLabel={OPEN_MENU_ARIA_LABEL}
      isDisabled={isUpdating}
    >
      {badgeMessage}
      {isUpdating && (
        <EuiLoadingSpinner style={{ marginLeft: '4px', marginRight: '4px' }} size="s" />
      )}
    </EuiBadge>
  );

  return (
    <EuiFlexGroup
      direction="column"
      alignItems="flexStart"
      justifyContent="flexStart"
      gutterSize="s"
    >
      <EuiFlexItem grow={false}>
        {isEditable ? (
          <EuiPopover
            button={editableBadge}
            isOpen={isPopoverOpen && isEditable}
            closePopover={onClosePopover}
            panelPaddingSize="s"
            data-test-subj="statusDropdown"
            title={badgeMessage}
          >
            <RuleStatusMenu
              onClosePopover={onClosePopover}
              onChangeEnabledStatus={onChangeEnabledStatus}
              onChangeSnooze={onChangeSnooze}
              isEnabled={isEnabled}
              isSnoozed={isSnoozed}
              snoozeEndTime={item.snoozeEndTime}
            />
          </EuiPopover>
        ) : (
          nonEditableBadge
        )}
      </EuiFlexItem>
      <EuiFlexItem data-test-subj="remainingSnoozeTime" grow={false}>
        {remainingSnoozeTime}
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

interface RuleStatusMenuProps {
  onChangeEnabledStatus: (enabled: boolean) => void;
  onChangeSnooze: (value: number | -1, unit?: SnoozeUnit) => void;
  onClosePopover: () => void;
  isEnabled: boolean;
  isSnoozed: boolean;
  snoozeEndTime?: Date | null;
}

const RuleStatusMenu: React.FunctionComponent<RuleStatusMenuProps> = ({
  onChangeEnabledStatus,
  onChangeSnooze,
  onClosePopover,
  isEnabled,
  isSnoozed,
  snoozeEndTime,
}) => {
  const enableRule = useCallback(() => {
    if (isSnoozed) {
      // Unsnooze if the rule is snoozed and the user clicks Enabled
      onChangeSnooze(0, 'm');
    } else {
      onChangeEnabledStatus(true);
    }
    onClosePopover();
  }, [onChangeEnabledStatus, onClosePopover, onChangeSnooze, isSnoozed]);
  const disableRule = useCallback(() => {
    onChangeEnabledStatus(false);
    onClosePopover();
  }, [onChangeEnabledStatus, onClosePopover]);

  const onApplySnooze = useCallback(
    (value: number, unit?: SnoozeUnit) => {
      onChangeSnooze(value, unit);
      onClosePopover();
    },
    [onClosePopover, onChangeSnooze]
  );

  let snoozeButtonTitle = <EuiText size="s">{SNOOZE}</EuiText>;
  if (isSnoozed && snoozeEndTime) {
    snoozeButtonTitle = (
      <>
        <EuiText size="s">{SNOOZE}</EuiText>{' '}
        <EuiText size="xs" color="subdued">
          {moment(snoozeEndTime).format(SNOOZE_END_TIME_FORMAT)}
        </EuiText>
      </>
    );
  }

  const panels = [
    {
      id: 0,
      width: 360,
      items: [
        {
          name: ENABLED,
          icon: isEnabled && !isSnoozed ? 'check' : 'empty',
          onClick: enableRule,
        },
        {
          name: DISABLED,
          icon: !isEnabled ? 'check' : 'empty',
          onClick: disableRule,
        },
        {
          name: snoozeButtonTitle,
          icon: isEnabled && isSnoozed ? 'check' : 'empty',
          panel: 1,
          disabled: !isEnabled,
        },
      ],
    },
    {
      id: 1,
      width: 360,
      title: SNOOZE,
      content: (
        <SnoozePanel
          applySnooze={onApplySnooze}
          interval={futureTimeToInterval(snoozeEndTime)}
          showCancel={isSnoozed}
        />
      ),
    },
  ];

  return <EuiContextMenu initialPanelId={0} panels={panels} />;
};

interface SnoozePanelProps {
  interval?: string;
  applySnooze: (value: number | -1, unit?: SnoozeUnit) => void;
  showCancel: boolean;
}

const SnoozePanel: React.FunctionComponent<SnoozePanelProps> = ({
  interval = '3d',
  applySnooze,
  showCancel,
}) => {
  const [intervalValue, setIntervalValue] = useState(parseInterval(interval).value);
  const [intervalUnit, setIntervalUnit] = useState(parseInterval(interval).unit);

  const onChangeValue = useCallback(
    ({ target }) => setIntervalValue(target.value),
    [setIntervalValue]
  );
  const onChangeUnit = useCallback(
    ({ target }) => setIntervalUnit(target.value),
    [setIntervalUnit]
  );

  const onApply1h = useCallback(() => applySnooze(1, 'h'), [applySnooze]);
  const onApply3h = useCallback(() => applySnooze(3, 'h'), [applySnooze]);
  const onApply8h = useCallback(() => applySnooze(8, 'h'), [applySnooze]);
  const onApply1d = useCallback(() => applySnooze(1, 'd'), [applySnooze]);
  const onApplyIndefinite = useCallback(() => applySnooze(-1), [applySnooze]);
  const onClickApplyButton = useCallback(
    () => applySnooze(intervalValue, intervalUnit as SnoozeUnit),
    [applySnooze, intervalValue, intervalUnit]
  );
  const onCancelSnooze = useCallback(() => applySnooze(0, 'm'), [applySnooze]);

  return (
    <EuiPanel paddingSize="none">
      <EuiSpacer size="s" />
      <EuiFlexGroup gutterSize="xs">
        <EuiFlexItem>
          <EuiFieldNumber
            value={intervalValue}
            onChange={onChangeValue}
            aria-label={i18n.translate(
              'xpack.triggersActionsUI.sections.rulesList.snoozePanelIntervalValueLabel',
              { defaultMessage: 'Snooze interval value' }
            )}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={2}>
          <EuiSelect
            id={useGeneratedHtmlId({ prefix: 'snoozeUnit' })}
            value={intervalUnit}
            onChange={onChangeUnit}
            aria-label={i18n.translate(
              'xpack.triggersActionsUI.sections.rulesList.snoozePanelIntervalUnitLabel',
              { defaultMessage: 'Snooze interval unit' }
            )}
            options={[
              { value: 'm', text: MINUTES },
              { value: 'h', text: HOURS },
              { value: 'd', text: DAYS },
              { value: 'w', text: WEEKS },
              { value: 'M', text: MONTHS },
            ]}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton onClick={onClickApplyButton}>
            {i18n.translate('xpack.triggersActionsUI.sections.rulesList.applySnooze', {
              defaultMessage: 'Apply',
            })}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiHorizontalRule margin="s" />
      <EuiFlexGrid columns={2} gutterSize="s">
        <EuiFlexItem>
          <EuiTitle size="xxs">
            <h5>
              {i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozeCommonlyUsed', {
                defaultMessage: 'Commonly used',
              })}
            </h5>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem />
        <EuiFlexItem>
          <EuiLink onClick={onApply1h}>
            {i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozeOneHour', {
              defaultMessage: '1 hour',
            })}
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiLink onClick={onApply3h}>
            {i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozeThreeHours', {
              defaultMessage: '3 hours',
            })}
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiLink onClick={onApply8h}>
            {i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozeEightHours', {
              defaultMessage: '8 hours',
            })}
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiLink onClick={onApply1d}>
            {i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozeOneDay', {
              defaultMessage: '1 day',
            })}
          </EuiLink>
        </EuiFlexItem>
      </EuiFlexGrid>
      <EuiHorizontalRule margin="s" />
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiLink onClick={onApplyIndefinite}>
            {i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozeIndefinitely', {
              defaultMessage: 'Snooze indefinitely',
            })}
          </EuiLink>
        </EuiFlexItem>
      </EuiFlexGroup>
      {showCancel && (
        <>
          <EuiHorizontalRule margin="s" />
          <EuiFlexGroup>
            <EuiFlexItem grow>
              <EuiButton color="danger" onClick={onCancelSnooze}>
                Cancel snooze
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </>
      )}
      <EuiSpacer size="s" />
    </EuiPanel>
  );
};

const isItemSnoozed = (item: { snoozeEndTime?: Date | null; muteAll: boolean }) => {
  const { snoozeEndTime, muteAll } = item;
  if (muteAll) return true;
  if (!snoozeEndTime) {
    return false;
  }
  return moment(Date.now()).isBefore(snoozeEndTime);
};

const futureTimeToInterval = (time?: Date | null) => {
  if (!time) return;
  const relativeTime = moment(time).locale('en').fromNow(true);
  const [valueStr, unitStr] = relativeTime.split(' ');
  let value = valueStr === 'a' || valueStr === 'an' ? 1 : parseInt(valueStr, 10);
  let unit;
  switch (unitStr) {
    case 'year':
    case 'years':
      unit = 'M';
      value = value * 12;
      break;
    case 'month':
    case 'months':
      unit = 'M';
      break;
    case 'day':
    case 'days':
      unit = 'd';
      break;
    case 'hour':
    case 'hours':
      unit = 'h';
      break;
    case 'minute':
    case 'minutes':
      unit = 'm';
      break;
  }

  if (!unit) return;
  return `${value}${unit}`;
};

const ENABLED = i18n.translate('xpack.triggersActionsUI.sections.rulesList.enabledRuleStatus', {
  defaultMessage: 'Enabled',
});

const DISABLED = i18n.translate('xpack.triggersActionsUI.sections.rulesList.disabledRuleStatus', {
  defaultMessage: 'Disabled',
});

const SNOOZED = i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozedRuleStatus', {
  defaultMessage: 'Snoozed',
});

const SNOOZE = i18n.translate('xpack.triggersActionsUI.sections.rulesList.snoozeMenuTitle', {
  defaultMessage: 'Snooze',
});

const OPEN_MENU_ARIA_LABEL = i18n.translate(
  'xpack.triggersActionsUI.sections.rulesList.ruleStatusDropdownMenuLabel',
  {
    defaultMessage: 'Change rule status or snooze',
  }
);

const MINUTES = i18n.translate('xpack.triggersActionsUI.sections.rulesList.minutesLabel', {
  defaultMessage: 'minutes',
});
const HOURS = i18n.translate('xpack.triggersActionsUI.sections.rulesList.hoursLabel', {
  defaultMessage: 'hours',
});
const DAYS = i18n.translate('xpack.triggersActionsUI.sections.rulesList.daysLabel', {
  defaultMessage: 'days',
});
const WEEKS = i18n.translate('xpack.triggersActionsUI.sections.rulesList.weeksLabel', {
  defaultMessage: 'weeks',
});
const MONTHS = i18n.translate('xpack.triggersActionsUI.sections.rulesList.monthsLabel', {
  defaultMessage: 'months',
});

const INDEFINITELY = i18n.translate(
  'xpack.triggersActionsUI.sections.rulesList.remainingSnoozeIndefinite',
  { defaultMessage: 'Indefinitely' }
);

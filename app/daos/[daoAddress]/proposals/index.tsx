import { Link, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { FlatList } from 'react-native-gesture-handler';
import { Divider, Surface as Paper } from 'react-native-paper';
import tinycolor from 'tinycolor2';

import styled, { css } from '@emotion/native';

import { Chevron } from '../../../../components/Chevron';
import LionText, { LionTextProps } from '../../../../components/LionText';
import Screen from '../../../../components/Screen';
import { useProposals } from '../../../../hooks/onchain/useProposals';
import { Resource } from '../../../../hooks/useResource';
import { PropData, Vote } from '../../../../misc/types';
import { shortenBigNum } from '../../../../misc/utils';
import { DAOSearchParams } from '../_types';
import useTheme from '../../../../hooks/useTheme';

export default function() {
  const params = useLocalSearchParams<DAOSearchParams>();
  const address = params.daoAddress!;
  const props = useProposals(address);

  return (
    <Screen title="Proposals">
      <Proposals res={props} />
    </Screen>
  )
}

function Proposals({ res }: { res: Resource<PropData[]> }) {
  const data = useMemo(() => res.read().reverse(), [res]);
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Proposal item={item} />}
    />
  )
}

function Proposal({ item }: { item: PropData }) {
  const { daoAddress } = useLocalSearchParams<DAOSearchParams>();
  const active = item.proposal.status === 'in_progress';
  const [collapsed, setCollapsed] = useState(!active);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(curr => !curr);
  }, []);

  return (
    <Surface>
      <TitleBar>
        <PropID bold={active}>{item.proposal.id}:</PropID>
        <View style={{ flex: 1 }}>
          <PropTitle bold={active}>{item.proposal.title.trim()}</PropTitle>
          <PropStatus status={item.proposal_status} />
        </View>
      </TitleBar>
      <PropVoteBar votes={item.results} collapsed={collapsed} />
      <DetailsLink id={item.proposal.id} />
      <PropDesc collapsed={collapsed}>
        <LionText>{item.proposal.description.trim()}</LionText>
      </PropDesc>
      <Divider />
      <Pressable onPress={toggleCollapsed}>
        <Chevron
          orientation={collapsed ? 'down' : 'up'}
          color="#666"
          style={css`
            align-self: center;
            margin: 4px 0;
          `}
        />
      </Pressable>
    </Surface>
  )
}

const Surface = styled(Paper)`
  margin: 8px;
  border-radius: 8px;
`

function TitleBar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={css`
      flex-direction: row;
      gap: 4px;
      background-color: ${theme.colors.onBackground};
      border-radius: 8px 8px 0 0;
      padding: 8px;
    `}>
      {children}
    </View>
  )
}

const PropID = ({ style, ...props }: LionTextProps) =>
  <LionText textAlign="right" color="white" style={[css`width: 30px; margin: 0;`, style]} {...props} />
const PropTitle = (props: LionTextProps) =>
  <LionText color="white" style={css`margin: 0;`} {...props} />
function PropDesc({ children, collapsed }: { children: React.ReactNode, collapsed?: boolean }) {
  return (
    <Collapsible collapsed={collapsed}>
      <View style={css`
        padding: 8px;
      `}>
        {children}
      </View>
    </Collapsible>
  )
}

const PropStatus = React.memo(({ status }: { status: string }) => {
  let color: string, text: string, italic = false;
  switch (status) {
    case 'in_progress':
      color = 'yellow';
      text = 'active';
      break;
    case 'executed':
      color = 'green';
      text = 'executed';
      break;
    case 'rejected':
      color = 'red';
      text = 'rejected';
      break;
    default:
      italic = true;
      text = 'unknown';
      color = 'darkgrey';
      console.log(status);
  }

  return (
    <LionText
      bold
      italic={italic}
      color={color}
      style={css`margin: 0;`}
    >
      {text}
    </LionText>
  )
})

type VoteLabel = 'yes' | 'no' | 'abstain' | 'veto' | 'other';
type VoteMap = {
  [K in VoteLabel]?: bigint;
}

const PropVoteBar = React.memo(({ votes, collapsed }: { votes: Vote[], collapsed?: boolean }) => {
  const byType = useMemo(() => {
    const types = ['yes', 'no', 'abstain', 'veto'] as const;
    const map = Object.fromEntries(votes.map(([type, count]) => [type, BigInt(count)]));
    const result: VoteMap = {};

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      if (i in map) {
        result[type] = map[i];
        delete map[i];
      }
    }
    result.other = Object.values(map).reduce((a, b) => a + b, 0n);
    if (result.other === 0n) delete result.other;

    return result;
  }, [votes]);

  return (
    <View style={css`
      flex-direction: column;
      align-items: stretch;
    `}>
      <View style={css`
        flex-direction: row;
      `}>
        <PropVoteBarSegment type="yes"     votes={byType} />
        <PropVoteBarSegment type="no"      votes={byType} />
        <PropVoteBarSegment type="veto"    votes={byType} />
        <PropVoteBarSegment type="abstain" votes={byType} />
        <PropVoteBarSegment type="other"   votes={byType} />
      </View>
      <Collapsible collapsed={collapsed}>
        <View style={css`
          flex-direction: row;
          margin-top: 4px;
        `}>
          <PropVoteBarSegmentLabel type="yes"     votes={byType} />
          <PropVoteBarSegmentLabel type="no"      votes={byType} />
          <PropVoteBarSegmentLabel type="veto"    votes={byType} />
          <PropVoteBarSegmentLabel type="abstain" votes={byType} />
          <PropVoteBarSegmentLabel type="other"   votes={byType} />
        </View>
        <View style={css`

        `}>
          <LionText fontSize={12} textAlign="center">
            Total votes: {shortenBigNum(Object.values(byType).reduce((a, b) => a + b, 0n))}
          </LionText>
        </View>
      </Collapsible>
    </View>
  )
})

const PropVoteBarSegment = React.memo(({ type, votes }: { type: VoteLabel, votes: VoteMap }) => {
  if (!votes[type]) return null;
  return (
    <View style={css`
      height: 3px;
      flex: ${votes[type]!.toString()};
      background-color: ${voteColor(type)};
    `} />
  )
})

const PropVoteBarSegmentLabel = React.memo(({ type, votes }: { type: VoteLabel, votes: VoteMap }) => {
  if (!votes[type]) return null;
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const total = Object.values(votes).reduce((a, b) => a + b, 0n);
  const percentage = votes[type]! * 100n / total;

  return (
    <LionText
      fontSize={12}
      color={voteColor(type, true)}
      textAlign="center"
      style={css`
        flex: ${votes[type]!.toString()};
        min-width: 50px;
      `}
    >
      {percentage === 0n ? '<1' : percentage.toString()}{'%\n'}
      {capitalize(type)}
    </LionText>
  )
})

function voteColor(vote: VoteLabel, isText = false) {
  switch (vote) {
    case 'yes': return 'green';
    case 'no': return 'red';
    case 'abstain': return tinycolor('yellow').darken(isText ? 20 : 0).toRgbString();
    case 'veto': return 'purple';
    case 'other': return 'grey';
  }
}

function DetailsLink({ id }: { id: number | string }) {
  const { daoAddress } = useLocalSearchParams<DAOSearchParams>();
  const theme = useTheme();
  return (
    <Link
      href={`/daos/${daoAddress}/proposals/${id}`}
      style={css`
        flex-direction: row;
        align-items: center;
        padding: 4px 8px;
      `}
    >
      <LionText color={theme.colors.grey[4]}>» Details</LionText>
    </Link>
  )
}

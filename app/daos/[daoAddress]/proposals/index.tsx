import { router, useLocalSearchParams } from 'expo-router'
import { FlatList } from 'react-native-gesture-handler'
import Screen from '../../../../components/Screen'
import { useProposals } from '../../../../hooks/onchain/useProposals'
import { Resource } from '../../../../hooks/useResource'
import { PropData } from '../../../../misc/types'
import { DAOSearchParams } from '../_types'
import LionText, { LionTextProps } from '../../../../components/LionText'
import { Divider, Surface as Paper, useTheme } from 'react-native-paper'
import styled, { css } from '@emotion/native'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { Chevron } from '../../../../components/Chevron'

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
  const active = item.proposal.status === 'in_progress';
  const [collapsed, setCollapsed] = useState(!active);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(curr => !curr);
  }, []);

  return (
    <Pressable onPress={toggleCollapsed}>
      <Surface>
        <TitleBar>
          <PropID bold={active}>{item.proposal.id}:</PropID>
          <View style={{ flex: 1 }}>
            <PropTitle bold={active}>{item.proposal.title.trim()}</PropTitle>
            {active && <LionText bold color="green" style={css`margin: 0;`}>in progress</LionText>}
          </View>
        </TitleBar>
        <PropDesc collapsed={collapsed}>
          <LionText>{item.proposal.description.trim()}</LionText>
        </PropDesc>
        <Divider />
        <Chevron
          orientation={collapsed ? 'down' : 'up'}
          color="#666"
          style={css`
            align-self: center;
            margin: 4px 0;
          `}
        />
      </Surface>
    </Pressable>
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

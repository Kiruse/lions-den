import { css } from '@emotion/native'
import { router } from 'expo-router'
import LionText from '../../components/LionText'
import Screen from '../../components/Screen'
import constants from '../../misc/constants'
import { TouchableRipple } from 'react-native-paper'

export default function() {
  return (
    <Screen title="DAOs">
      <DaoLink address={constants.terra2.addresses.LionDAO}>Lion DAO</DaoLink>
      <DaoLink address={constants.terra2.addresses.pixeLionsDAO}>pixeLions DAO</DaoLink>
    </Screen>
  )
}

interface DaoLinkProps {
  children?: string; // will be removed later & queried from the blockchain instead
  address: string;
}
function DaoLink({ children, address }: DaoLinkProps) {
  return (
    <TouchableRipple
      onPress={() => router.push(`/daos/${address}/proposals`)}
      style={css`
        padding: 8px;
      `}
    >
      <LionText bold>{children}</LionText>
    </TouchableRipple>
  )
}

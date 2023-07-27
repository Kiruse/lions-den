import { css } from '@emotion/native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { TouchableRipple, useTheme } from 'react-native-paper'
import tinycolor from 'tinycolor2'
import LionText from '../../components/LionText'
import Screen from '../../components/Screen'
import constants from '../../misc/constants'

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
  const theme = useTheme();
  return (
    <TouchableRipple onPress={() => router.push(`/daos/${address}/proposals`)}>
      <LinearGradient
        colors={[
          theme.colors.primary,
          tinycolor(theme.colors.primary).darken(10).toRgbString(),
        ]}
        style={css`
          padding: 8px;
        `}
      >
        <LionText bold>{children}</LionText>
      </LinearGradient>
    </TouchableRipple>
  )
}

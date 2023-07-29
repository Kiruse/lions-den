import { css } from '@emotion/native'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Divider, Surface, useTheme } from 'react-native-paper'
import LionText, { LionTitle } from '../components/LionText'
import RoarLogo from '../components/RoarLogo'
import Screen from '../components/Screen'
import { getNews } from '../hooks/firebase'
import useAsyncEffect from '../hooks/useAsyncEffect'
import { FirestoreDate, News } from '../misc/types'
import { fromFirestoreDate, isFirestoreDate } from '../misc/utils'

export default function App() {
  const [data, setData] = useState<News[]>([]);
  const theme = useTheme();

  const fetchNews = useCallback(async () => {
    setData(await getNews());
  }, []);
  useAsyncEffect(fetchNews, []);

  return (
    <Screen title="Lions of Terra" background={undefined} style={{ padding: 8 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => <NewsItem item={item} />}
        ListHeaderComponent={Header}
        ListEmptyComponent={<ActivityIndicator size="large" color={theme.colors.primary} />}
      />
    </Screen>
  )
}

function Header() {
  return (
    <View style={css`
      flex-direction: column;
      align-items: center;
    `}>
      <RoarLogo size={256} />
      <LionTitle textAlign="center">Lion News</LionTitle>
    </View>
  )
}

interface NewsItemProps {
  item: News;
}

function NewsItem({ item }: NewsItemProps) {
  return (
    <Surface style={css`
      margin: 8px;
      padding: 8px;
    `}>
      <View style={css`flex-direction: row; gap: 4px;`}>
        {isFirestoreDate(item.date) && <LionText fontSize={12} color="#666">{getDateDisplay(item.date)}</LionText>}
        {item.author && <LionText fontSize={12} color="#666" italic>by {item.author}</LionText>}
      </View>
      <LionTitle style={css`margin: 0 0 8px 0;`}>{item.title}</LionTitle>
      <Divider style={css`margin-bottom: 8px;`} />
      <View>
        <LionText>{item.content}</LionText>
      </View>
    </Surface>
  )
}

function getDateDisplay(raw: FirestoreDate) {
  const date = fromFirestoreDate(raw);
  return `${date.getDay()}. ${getMonthName(date.getMonth())} '${date.getFullYear().toString().slice(2)}`;
}
function getMonthName(month: number) {
  return [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ][month];
}

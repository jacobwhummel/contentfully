import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useLayoutEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Entry } from '../components/entry/entry';
import { Container } from '../components/shared/container';
import { RefreshControl } from '../components/shared/refresh-control';
import { CardTitle } from '../components/shared/typography';
import { useEntries } from '../hooks/entry';
import { useDefaultLocale } from '../hooks/locales';
import { useModels } from '../hooks/models';
import { ContentStackParamList } from '../navigation/navigation';
import { font } from '../styles';

export type ContentViewNavigationProp = NativeStackScreenProps<
  ContentStackParamList,
  'Entries'
>;

type Props = {
  navigation: ContentViewNavigationProp['navigation'];
};

export const Content: FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { data, isRefetching, refetch, fetchNextPage } = useEntries([
    { type: 'query', parameter: search },
  ]);
  const { data: locale } = useDefaultLocale();
  const { data: models } = useModels();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onSearchButtonPress: event => setSearch(event.nativeEvent.text),
        onCancelButtonPress: () => setSearch(undefined),
      },
    });
  }, [navigation]);

  console.log(data);

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      style={{}}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      ListHeaderComponent={() => (
        <HContainer horizontal>
          {models?.items?.map(model => (
            <ModelButton key={model.sys.id}>
              <ButtonText>{model.name}</ButtonText>
            </ModelButton>
          ))}
        </HContainer>
      )}
      data={data?.entries}
      renderItem={({ item }) => (
        <Entry locale={locale?.code} entry={item} key={item?.sys?.id} />
      )}
      progressViewOffset={100}
      onEndReached={() => fetchNextPage()}
    />
  );
};

const HContainer = styled.ScrollView`
  flex-direction: row;
  background-color: white;
  margin: 8px;
  border-radius: 8px;
  padding: 8px 16px;
`;

const ModelButton = styled.TouchableOpacity`
  flex: 1;
  padding: 8px 8px;
`;

const ButtonText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-family: ${font.regular};
`;

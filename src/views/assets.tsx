import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useLayoutEffect, useState } from 'react';
import styled from 'styled-components/native';
import { MediaItem } from '../components/media/media-item';
import { Container } from '../components/shared/container';
import { RefreshControl } from '../components/shared/refresh-control';
import { useDefaultLocale } from '../hooks/locales';
import { useAssets } from '../hooks/media';
import { AssetStackParamList } from '../navigation/navigation';

export type AllMediaScreenProp = NativeStackScreenProps<
  AssetStackParamList,
  'Assets'
>;

export const Assets: FC<AllMediaScreenProp> = ({ navigation }) => {
  const [, setSearch] = useState<undefined | string>(undefined);
  const { data, refetch, isRefetching } = useAssets();
  const { data: locale } = useDefaultLocale();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onSearchButtonPress: event => setSearch(event.nativeEvent.text),
        onCancelButtonPress: () => setSearch(undefined),
      },
    });
  }, [navigation]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }>
      <Container>
        {data?.items?.map(item => (
          <MediaItem
            navigation={navigation}
            key={item.sys.id}
            locale={locale?.code}
            media={item}
          />
        ))}
      </Container>
    </ScrollView>
  );
};

const ScrollView = styled.ScrollView``;

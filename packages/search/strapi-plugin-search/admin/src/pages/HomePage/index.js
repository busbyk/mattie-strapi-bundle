/*
 *
 * HomePage
 *
 */

import React from 'react';
import { Layout, BaseHeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Flex } from '@strapi/design-system/Flex';
import { LinkButton } from '@strapi/design-system/LinkButton';

const HomePage = () => {
  return (
    <Layout>
      <BaseHeaderLayout title="Search" subtitle="" as="h2" />

      {/* <ContentLayout>
        <Flex direction="column" alignItems="start" gap={4}>
          <LinkButton
            to="/content-manager/collectionType/api::credit-card.credit-card"
            fullWidth
            style={{ marginBottom: "12px" }}
          >
            View all Credit Cards
          </LinkButton>
          <Flex direction="row" gap={2}>
            <RefreshAllCreditCardsButton />
            <RefreshBankrateCreditCardsButton />
            <RefreshNextinsureCreditCardsButton />
          </Flex>
        </Flex>
      </ContentLayout> */}
    </Layout>
  );
};

export default HomePage;

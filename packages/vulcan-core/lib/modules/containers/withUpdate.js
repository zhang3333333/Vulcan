/*

Generic mutation wrapper to edit a document in a collection. 

Sample mutation: 

  mutation updateMovie($documentId: String, $set: MoviesInput, $unset: MoviesUnset) {
    updateMovie(documentId: $documentId, set: $set, unset: $unset) {
      ...MovieFormFragment
    }
  }

Arguments: 

  - documentId: the id of the document to modify
  - set: an object containing all the fields to modify and their new values
  - unset: an object containing the fields to unset

Child Props:

  - updateMovie(documentId, set, unset)
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection, updateClientTemplate } from 'meteor/vulcan:lib';
import clone from 'lodash/clone';

export default function withUpdate(options) {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName || `${collectionName}DefaultFragment`),
        fragmentName = getFragmentName(fragment),
        typeName = collection.options.typeName,
        query = gql`${updateClientTemplate({ typeName, fragmentName })}${fragment}`;

  return graphql(query, {
    alias: `withUpdate${typeName}`,
    props: ({ ownProps, mutate }) => ({
      [`update${typeName}`]: (args) => {
        const { selector, data } = args;
        return mutate({ 
          variables: { input: { selector, data } }
          // note: updateQueries is not needed for editing documents
        });
      },
      // OpenCRUD backwards compatibility
      editMutation: (args) => {
        const { documentId, set, unset } = args;
        const selector = { documentId };
        const data = clone(set);
        Object.keys(unset).forEach(fieldName => {
          data[fieldName] = null;
        });
        return mutate({ 
          variables: { input: { selector, data } }
          // note: updateQueries is not needed for editing documents
        });
      }
    }),
  });

}
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { Meteor } from 'meteor/meteor';
import Telescope from 'meteor/nova:lib';

/**
 * withCurrentUser - HOC to give access to the currentUser as a prop of a WrappedComponent
 **/
export default function withCurrentUser(WrappedComponent) {

  const WithCurrentUser = (props, context) => {

    const {client} = context; // grab the apollo client from the context

    const currentUser = client ? client.store.getState().apollo.data[`User${Meteor.userId()}`] : null;

    return currentUser ? <WrappedComponent currentUser={currentUser} {...props} /> : <WrappedComponent {...props} />;
  }

  WithCurrentUser.contextTypes = { client: PropTypes.object.isRequired };
  WithCurrentUser.displayName = `withCurrentUser(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithCurrentUser.WrappedComponent = WrappedComponent;

  return hoistStatics(WithCurrentUser, WrappedComponent);
}
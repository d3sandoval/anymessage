/**
 * Copyright (c) AnyMessage.io. All rights reserved. http://www.anymessage.io
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.md file.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Drawer, withWidth, withStyles,
} from '@material-ui/core';
import { ExpandMore, Menu } from '@material-ui/icons';

import { AuthService, withAuth } from '../../util';

import UserNameGroup from './UserNameGroup';
import UserMenuOptions from './UserMenuOptions';

const styles = theme => ({
  loginButton: {
    marginLeft: -12,
  },
});

class UserMenu extends React.Component {
  state = {
    loaded: false,
    open: false,
  }

  componentDidMount() {
    this.auth = new AuthService();
    this.setState({ loaded: true });
  }

  handleMenuClick = () => {
    this.setState({ open: true });
  };

  handleMenuClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      classes, width, user, currentPage,
    } = this.props;
    const { loaded, open } = this.state;

    if (user) {
      return (
        <div className={classes.loginButton}>
          <Button
            color="inherit"
            aria-haspopup="true"
            onClick={this.handleMenuClick}
          >
            {(width === 'sm' || width === 'xs')
              ? <Menu />
              : (
                <UserNameGroup
                  rightIcon={<ExpandMore />}
                />
              )}

          </Button>
          <Drawer anchor="right" open={open} onClose={this.handleMenuClose}>
            <UserMenuOptions
              authLink={loaded ? this.auth.logout : null}
              closeLink={this.handleMenuClose}
              currentPage={currentPage}
            />
          </Drawer>
        </div>
      );
    }
    return <Button className={classes.loginButton} onClick={loaded ? this.auth.login : null} color="inherit">Login</Button>;
  }
}

UserMenu.defaultProps = {
  width: 'sm',
  user: null,
  currentPage: null,
};
UserMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string,
  user: PropTypes.object,
  currentPage: PropTypes.string,
};

export default withAuth(withWidth()(withStyles(styles)(UserMenu)));

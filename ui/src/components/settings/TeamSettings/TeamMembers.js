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
  Grid, Typography, TextField, withStyles, Button,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

import {
  post, get, AuthService, withAuth,
} from '../../../util';
import UserNameGroup from '../../UserNameGroup';
import AddTeamMemberDialog from './AddTeamMemberDialog';

const styles = {
  root: {
    marginBottom: 24,
  },
  addNewButton: {
    marginTop: 8,
  },
  addIcon: {
    marginRight: 4,
  },
  member: {
    marginTop: 4,
  },
};

class TeamMembers extends React.Component {
  state = {
    addOpen: false,
    members: [],
  }

  componentDidMount = () => {
    const { user } = this.props;
    // todo get members from endpoint here
    this.setState({
      members: [user],
    });
  }

  addMember = (newMember) => {
    const { members } = this.state;
    // this is broken :(
    const found = this.findMemberInArray(newMember.email);
    if (found === -1) {
      this.setState({
        members: members.push(newMember),
      });
    } else {
      const newMembers = members;
      newMembers[found] = newMember;
      this.setState({
        members: newMembers,
      });
    }
  }

  addTeamMemberOpen = () => {
    this.setState({
      addOpen: true,
    });
  }

  addTeamMemberClose = () => {
    this.setState({
      addOpen: false,
    });
  }

  findMemberInArray(memberEmail) {
    const { members } = this.state;
    let found = -1;
    for (let i = 0; i < members.length; i++) {
      if (members[i].email === memberEmail) {
        found = i;
        break;
      }
    }
    return found;
  }

  render() {
    const { classes } = this.props;
    const { addOpen, members } = this.state;
    const membersArray = Array.from(members);
    return (
      <div className={classes.root}>
        <Typography variant="overline">
          Team Members:
        </Typography>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          {membersArray.map(member => (
            <Grid item xs={12} sm={6} md={4} className={classes.member}>
              <UserNameGroup key={member.email} user={member} justify="flex-start" />
            </Grid>
          ))}
        </Grid>
        <Button onClick={this.addTeamMemberOpen} className={classes.addNewButton}>
          <Add className={classes.addIcon} />
          Add Team Member
        </Button>
        <AddTeamMemberDialog open={addOpen} handleClose={this.addTeamMemberClose} addMember={this.addMember} />
      </div>
    );
  }
}

TeamMembers.defaultProps = {
  user: null,
};
TeamMembers.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default withAuth(withStyles(styles)(TeamMembers));
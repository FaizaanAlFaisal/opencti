import React, { useState } from 'react';
import { graphql, useMutation } from 'react-relay';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide, { SlideProps } from '@mui/material/Slide';
import MoreVert from '@mui/icons-material/MoreVert';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { useFormatter } from '../../../../components/i18n';
import GroupEdition from './GroupEdition';
import { Theme } from '../../../../components/Theme';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    margin: 0,
  },
  drawerPaper: {
    minHeight: '100vh',
    width: '50%',
    position: 'fixed',
    overflow: 'auto',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    padding: 0,
  },
}));

const Transition = React.forwardRef((props: SlideProps, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = 'TransitionSlide';

const groupPopoverCleanContext = graphql`
  mutation GroupPopoverCleanContextMutation($id: ID!) {
    groupEdit(id: $id) {
      contextClean {
        ...GroupEditionContainer_group
      }
    }
  }
`;

const groupPopoverDeletionMutation = graphql`
  mutation GroupPopoverDeletionMutation($id: ID!) {
    groupEdit(id: $id) {
      delete
    }
  }
`;

const GroupPopover = ({ groupId }: { groupId: string }) => {
  const classes = useStyles();
  const { t } = useFormatter();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [displayUpdate, setDisplayUpdate] = useState(false);
  const [displayDelete, setDisplayDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commitCleanContext] = useMutation(groupPopoverCleanContext);
  const [commitDeleteMutation] = useMutation(groupPopoverDeletionMutation);

  const handleOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUpdate = () => {
    setDisplayUpdate(true);
    handleClose();
  };

  const handleCloseUpdate = () => {
    commitCleanContext({
      variables: { id: groupId },
    });
    setDisplayUpdate(false);
  };

  const handleOpenDelete = () => {
    setDisplayDelete(true);
    handleClose();
  };

  const handleCloseDelete = () => {
    setDisplayDelete(false);
  };

  const submitDelete = () => {
    setDeleting(true);
    commitDeleteMutation({
      variables: {
        id: groupId,
      },
      onCompleted: () => {
        setDeleting(false);
        handleClose();
        history.push('/dashboard/settings/accesses/groups');
      },
    });
  };

  return (
    <div className={classes.container}>
      <IconButton
        onClick={(event) => handleOpen(event)}
        aria-haspopup="true"
        size="large"
        style={{ marginTop: 3 }}
      >
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleOpenUpdate}>{t('Update')}</MenuItem>
        <MenuItem onClick={handleOpenDelete}>{t('Delete')}</MenuItem>
      </Menu>
      <Drawer
        open={displayUpdate}
        anchor="right"
        sx={{ zIndex: 1202 }}
        elevation={1}
        classes={{ paper: classes.drawerPaper }}
        onClose={handleCloseUpdate}
      >
        <GroupEdition groupId={groupId} handleClose={handleCloseUpdate} />
      </Drawer>
      <Dialog
        open={displayDelete}
        PaperProps={{ elevation: 1 }}
        keepMounted={true}
        TransitionComponent={Transition}
        onClose={handleCloseDelete}
      >
        <DialogContent>
          <DialogContentText>
            {t('Do you want to delete this group?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={deleting}>
            {t('Cancel')}
          </Button>
          <Button color="secondary" onClick={submitDelete} disabled={deleting}>
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GroupPopover;

import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { graphql, useFragment } from 'react-relay';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { KeyboardArrowRight } from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import makeStyles from '@mui/styles/makeStyles';
import { useFormatter } from '../../../../components/i18n';
import StixCoreObjectLabels from '../../common/stix_core_objects/StixCoreObjectLabels';
import ItemMarkings from '../../../../components/ItemMarkings';
import ItemStatus from '../../../../components/ItemStatus';
import ItemSeverity from '../../../../components/ItemSeverity';
import ItemIcon from '../../../../components/ItemIcon';
import { Theme } from '../../../../components/Theme';
import { DataColumns } from '../../../../components/list_lines';
import { IncidentLine_node$key } from './__generated__/IncidentLine_node.graphql';

const useStyles = makeStyles<Theme>((theme) => ({
  item: {
    paddingLeft: 10,
    height: 50,
  },
  itemIcon: {
    color: theme.palette.primary.main,
  },
  bodyItem: {
    height: 20,
    fontSize: 13,
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: 5,
  },
  goIcon: {
    position: 'absolute',
    right: -10,
  },
  itemIconDisabled: {
    color: theme.palette.grey?.[700],
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: theme.palette.grey?.[700],
  },
  chipInList: {
    fontSize: 12,
    height: 20,
    float: 'left',
    width: 120,
  },
}));
interface IncidentLineComponentProps {
  dataColumns: DataColumns;
  node: IncidentLine_node$key;
  onLabelClick: () => void
}

const IncidentLineFragment = graphql`
    fragment IncidentLine_node on Incident {
        id
        name
        incident_type
        severity
        created
        modified
        confidence
        objectMarking {
            edges {
                node {
                    id
                    definition_type
                    definition
                    x_opencti_order
                    x_opencti_color
                }
            }
        }
        objectLabel {
            edges {
                node {
                    id
                    value
                    color
                }
            }
        }
        status {
            id
            order
            template {
                name
                color
            }
        }
        workflowEnabled
    }
`;

export const IncidentLine : FunctionComponent<IncidentLineComponentProps> = ({ dataColumns, node, onLabelClick }) => {
  const classes = useStyles();
  const { fd, t } = useFormatter();
  const data = useFragment(IncidentLineFragment, node);

  return (
    <ListItem
      classes={{ root: classes.item }}
      divider={true}
      button={true}
      component={Link}
      to={`/dashboard/events/incidents/${data.id}`}
    >
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        <ItemIcon type="Incident" />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.name.width }}
            >
              {data.name}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.incident_type.width }}
            >
              <Chip
                classes={{ root: classes.chipInList }}
                color="primary"
                variant="outlined"
                label={data.incident_type || t('Unknown')}
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.severity.width }}
            >
              <ItemSeverity
                severity={data.severity}
                label={t(data.severity || 'Unknown')}
                variant="inList"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.objectLabel.width }}
            >
              <StixCoreObjectLabels
                variant="inList"
                labels={data.objectLabel}
                onClick={onLabelClick}
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.created.width }}
            >
              {fd(data.created)}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.modified.width }}
            >
              {fd(data.modified)}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.x_opencti_workflow_id.width }}
            >
              <ItemStatus
                status={data.status}
                variant="inList"
                disabled={!data.workflowEnabled}
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.objectMarking.width }}
            >
              <ItemMarkings
                variant="inList"
                markingDefinitionsEdges={data.objectMarking?.edges ?? []}
                limit={1}
              />
            </div>
          </div>
        }
      />
      <ListItemIcon classes={{ root: classes.goIcon }}>
        <KeyboardArrowRight />
      </ListItemIcon>
    </ListItem>
  );
};

export const IncidentLineDummy = ({ dataColumns }: { dataColumns: DataColumns }) => {
  const classes = useStyles();
  return (
      <ListItem classes={{ root: classes.item }} divider={true}>
        <ListItemIcon classes={{ root: classes.itemIcon }}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={30}
            height={30}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.name.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="90%"
                  height="100%"
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.incident_type.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="90%"
                  height="100%"
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.severity.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="90%"
                  height="100%"
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.objectLabel.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="90%"
                  height="100%"
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.created.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={140}
                  height="100%"
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.modified.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={140}
                  height="100%"
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.x_opencti_workflow_id.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="90%"
                  height="100%"
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.objectMarking.width }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={140}
                  height="100%"
                />
              </div>
            </div>
          }
        />
        <ListItemIcon classes={{ root: classes.goIcon }}>
          <KeyboardArrowRight />
        </ListItemIcon>
      </ListItem>
  );
};
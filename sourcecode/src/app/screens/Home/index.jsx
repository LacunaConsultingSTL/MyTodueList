import React, {useEffect, useState} from 'react';
import {
  AppBar,
  Button,
  Collapse,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
  Box,
  Card,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  ExpandLess,
  ExpandMore,
  MenuRounded,
  PowerSettingsNew as LogOutIcon
} from '@material-ui/icons';
import firebase from '../../services/firebase';
import TodoItemList from "../../components/todoItemList";
import logo from '../../assets/images/logo.png';

const drawerWidth = 240;

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "#fff"
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  button: {
    position: 'fixed',
    right: 15,
    top: 15,
    height: 'auto',
    color: "white",
    background: "#3dd19d",
  },

  logoutButton: {
    position: 'fixed',
    right: 40,
    top: 25,
    height: 'auto',
    color: "black",
    background: "white",
    fontSize: '18px'

  },

  todoListRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    
  },
  emptyListText: {
    display: 'block',
    whiteSpace: 'initial',
    padding: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#777777'
  },
  nested: {
    paddingLeft: theme.spacing(5),
  },
  addTodoListButton: {
    outline: '0 !important',
    width: '100%'
  },
  listRemoveButton: {
    outline: '0 !important',
  }
}));

function useTodoLists(currentUserId) {
  const [todoLists, setTodoLists] = React.useState([]);
  
  useEffect(() => {
    firebase
      .firestore()
      .collection(currentUserId)
      .onSnapshot((snapShot) => {
        const newTodoLists = [];
        snapShot.docs.map((doc) => {
          let tempData = {};
          tempData = doc.data();
          tempData.id = doc.id;
          newTodoLists.push(tempData);
        })
        setTodoLists(newTodoLists);
      })
  }, []);
  return todoLists;
}

function HomePage(props) {
  const classes = styles();
  
  const currentUserName = firebase.auth().currentUser && firebase.auth().currentUser.displayName;
  if (!currentUserName) {
    // not logged in
    alert('Please login first')
    props.history.replace('/')
    return null
  }
  
  const currentUserId = firebase.auth().currentUser.uid;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const todoLists = useTodoLists(currentUserId);
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [todoListsOpen, setTodoListsOpen] = useState(true);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedIndex, setSelectedIndex] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedList, setSelectedList] = useState(todoLists[0]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedListEditItemIndex, setSelectedListEditItemIndex] = useState(3.14);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showEditTodoDialog, setShowEditTodoDialog] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showNewTodoDialog, setShowNewTodoDialog] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectNewAddedList, setSelectNewAddedList] = useState('');
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openDrawer, setOpenDrawer] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // firebase.getCurrentUserQuote().then(setQuote)
    console.log('Effect working.');
    console.log(todoLists);
    console.log(selectedList);
    if (!selectedList) {
      handleListItemClick(todoLists[0], 0);
    }
    
    console.log('------ NEW LIST SELECT ------');
    console.log(selectNewAddedList);
    if (selectNewAddedList !== '') {
      todoLists.map((item, index) => {
        if (item.id === selectNewAddedList) {
          setSelectNewAddedList('');
          handleListItemClick(item, index);
        }
      })
    }
  })
  
  const handleListItemClick = (list, index) => {
    setSelectedIndex(index);
    setSelectedList(list);
  };
  
  async function logout() {
    // await firebase.logout()
    await firebase.auth().signOut();
    props.history.push('/')
  }
  
  const addTodoList = () => {
    console.log('addTodoList');
    setShowNewListDialog(true);
  }
  
  const openEditTodoDialog = (list, index) => {
    console.log('openEditTodoDialog --> ' + index);
    console.log(list);
    setSelectedListEditItemIndex(index)
    setShowEditTodoDialog(true);
  }
  
  const openNewTodoDialog = () => {
    console.log('openNewTodoDialog');
    setShowNewTodoDialog(true);
  }
  
  const updateTodoList = (list) => {
    firebase
      .firestore()
      .collection(currentUserId)
      .doc(selectedList.id)
      .set({
        name: list.name,
        todoList: list.todoList
      })
      .then((e) => {
        console.log(e)
      });
  }
  
  const saveEditTodo = (title, detail, date) => {
    console.log('saveEditTodo');
    if (title !== '' && detail !== '') {
      selectedList.todoList[selectedListEditItemIndex].name = title;
      selectedList.todoList[selectedListEditItemIndex].detail = detail;
      selectedList.todoList[selectedListEditItemIndex].date = new Date(date).getTime();
      
      updateTodoList(selectedList);
      setShowEditTodoDialog(false);
      setSelectedListEditItemIndex(3.14);
    } else {
      alert('Please check the form again, and make sure that there is no missing space.');
    }
  }
  
  const saveNewTodo = (title, detail, date) => {
    console.log('saveNewTodo');
    if (title !== '' && detail !== '') {
      selectedList.todoList.push({
        name: title,
        detail: detail,
        date: new Date(date).getTime(),
        isComplete: false,
        createDate: new Date().getTime()
      });
      console.log(selectedList);
      
      updateTodoList(selectedList);
      setShowNewTodoDialog(false);
    } else {
      alert('Please check the form again, and make sure that there is no missing space.');
    }
  }
  
  const saveNewTodoList = (title) => {
    console.log('saveNewTodo');
    if (title !== '') {
      firebase
        .firestore()
        .collection(currentUserId)
        .add({
          name: title,
          todoList: []
        })
        .then((doc) => {
          setSelectNewAddedList(doc.id);
          setShowNewListDialog(false);
        })
      
    } else {
      alert('Please check the form again, and make sure that there is no missing space.');
    }
  }
  
  const removeTodoList = (event, list, index) => {
    event.stopPropagation();
    
    firebase
      .firestore()
      .collection(currentUserId)
      .doc(list.id)
      .delete()
      .then((e) => {
        if (list.id === selectedList.id) {
          handleListItemClick(todoLists[0], 0);
        }
      })
  }
  
  function renderEditDialog() {
    console.log('renderEditDialog');
    console.log(selectedList);
    if ((selectedListEditItemIndex % 1) === 0) {
      let editItem = selectedList.todoList[selectedListEditItemIndex];
      let date = calculateFullDate(editItem.date);
      let title = editItem.name;
      let detail = editItem.detail;
      
      console.log(editItem);
      
      return (
        <Dialog open={showEditTodoDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">EDIT</DialogTitle>
          <DialogContent>
            <DialogContentText>
            You can edit Todo Item information here.
            </DialogContentText>
            <TextField
              autoFocus
              defaultValue={title}
              onChange={(event) => title = event.target.value}
              margin="dense"
              id="todo-title"
              label="Todue Title"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              defaultValue={detail}
              onChange={(event) => detail = event.target.value}
              margin="dense"
              id="todo-detail"
              label="Todue Detail"
              type="text"
              fullWidth
            />
            <TextField
              defaultValue={date}
              onChange={(event) => date = event.target.value}
              id="todo-datetime"
              label="date"
              type="datetime-local"
              // defaultValue="2020-05-16T18:30"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setShowEditTodoDialog(false);
              setSelectedListEditItemIndex(3.14);
            }} color="secondary">
              CLOSE
            </Button>
            <Button onClick={() => saveEditTodo(title, detail, date)} color="primary">
              SAVE
            </Button>
          </DialogActions>
        </Dialog>
      )
    } else {
      return (<div></div>)
    }
  }
  
  function renderNewTodoDialog() {
    console.log('renderNewTodoDialog');
    let date = calculateFullDate(new Date().getTime());
    let title = '';
    let detail = '';
    
    return (
      <Dialog open={showNewTodoDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={title}
            onChange={(event) => title = event.target.value}
            margin="dense"
            id="todo-title"
            label="Main goal/ objective"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            defaultValue={detail}
            onChange={(event) => detail = event.target.value}
            margin="dense"
            id="todo-detail"
            label="Details, context, miltestones and tips etc"
            type="text"
            fullWidth
          />
          <TextField
            defaultValue={date}
            onChange={(event) => date = event.target.value}
            id="todo-datetime"
            label="Due date"
            type="datetime-local"
            // defaultValue="2020-05-16T18:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewTodoDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => saveNewTodo(title, detail, date)} color="primary">
            Add task
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  
  function renderNewListDialog() {
    console.log('renderNewListDialog');
    let title = '';
    
    return (
      <Dialog open={showNewListDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Create, assign, track, and share todue boards across groups, teams, or organizations. 
          </DialogContentText>
          <TextField
            autoFocus
            defaultValue={title}
            onChange={(event) => title = event.target.value}
            margin="dense"
            id="todo-title"
            label="Todo List Title"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewListDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => saveNewTodoList(title)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  
  function renderLists() {
    if (todoLists.length > 0) {
      return todoLists.map((list, index) => {
        return (
          <ListItem button className={classes.nested} key={list.id}
                    selected={selectedIndex === index}
                    onClick={() => {handleListItemClick(list, index); setOpenDrawer(!openDrawer)}}>
            <ListItemText style={{whiteSpace: 'initial'}} primary={list.name}/>
            <IconButton aria-label="delete" className={classes.listRemoveButton} onClick={(event) => {
              removeTodoList(event, list, index);
            }}>
              <DeleteIcon/>
            </IconButton>
          </ListItem>
        )
      })
    } else {
      return (
        <div>
          <span className={classes.emptyListText}>Add your first todue...</span>
        </div>
      )
    }
  }
  
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
        <Button color="primary" onClick={() => setOpenDrawer(!openDrawer)}>
          <MenuRounded />
        </Button>
          <Button href="/home" style={{textTransform:"none"}}>
          <Typography style={{paddingTop:"10px"}} color="primary" variant="h4" noWrap>
            <img alt="logo" style={{paddingRight:'5px', marginBottom:"10px"}} width="30px" height="35px" src={logo}></img>
            Todue
          </Typography>
          </Button>
          <div
            variant="contained"
            className={classes.logoutButton}
            onClick={logout}
            
          >
            Log Out
          </div>
        </Toolbar>
      </AppBar>
      {console.log(openDrawer)}
      <Drawer
        className={classes.drawer}
        //variant="permanent"
        variant="temporary"
        classes={{
          paper: classes.drawerPaper,
        }}
        open={openDrawer}
        onClose={() => setOpenDrawer(!openDrawer)}
        // style={window.screen.availWidth<500 ? {display: 'none'} : {}}
      >
      {/* {console.log(window.screen.availWidth)} */}
        <Toolbar/>
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button onClick={() => setTodoListsOpen(!todoListsOpen)}>
              <ListItemIcon style={{color:"lightgreen"}}>
                <AssignmentIcon/>
              </ListItemIcon>
              <ListItemText primary="Todue Boards"/>
              {todoListsOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={todoListsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderLists()}
              </List>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.addTodoListButton}
                onClick={() => addTodoList()}
            
              >+ Create Board</Button>
            </Collapse>
          
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
        <TodoItemList list={selectedList ? selectedList : {}} updateTodoList={(list) => updateTodoList(list)}
                      openEditDialog={(list, index) => openEditTodoDialog(list, index)}
                      openNewTodoDialog={() => openNewTodoDialog()}/>
        <Box display="flex" justifyContent="center" mt={10} mb={5} p={2}>
          <Card elevation={2}>
            <Typography variant="body1" style={{padding: "10px"}}>
            Create, assign, track, and share todue boards across groups, teams, or organizations.  
              <a target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}} href="https://forms.gle/CVBbiajoySqQtTgo8">
                <Typography display="inline" color="primary"> Join Email List</Typography>
              </a>
            </Typography> 
          </Card>
        </Box>
        <Box display="flex" justifyContent="center" mt={10} mb={5}>
          <Typography variant="body1">
            Copyright 2020. Made by 
            <a target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}} href="https://twitter.com/DannyMullan6">
              <Typography display="inline" color="primary"> @DannyMullan6 </Typography>
            </a>
          </Typography> 
        </Box>
      </main>
      
      {renderEditDialog()}
      {renderNewTodoDialog()}
      {renderNewListDialog()}
    
    </div>
  );
}

const twoDigitDateTextMaker = (time) => {
  let text = time.toString();
  if (text.toString().length > 1) {
    return text;
  } else {
    return '0' + text;
  }
}

const calculateFullDate = (time) => {
  // Return Type -> DD-MM-YYYYTHH:MM
  const eventDate = new Date(time);
  const resDate = twoDigitDateTextMaker(eventDate.getUTCFullYear()) + '-' + twoDigitDateTextMaker(eventDate.getUTCMonth() + 1) + '-' + twoDigitDateTextMaker(eventDate.getUTCDate()) + 'T' + twoDigitDateTextMaker(eventDate.getHours()) + ':' + twoDigitDateTextMaker(eventDate.getMinutes());
  return resDate;
}

export default HomePage;

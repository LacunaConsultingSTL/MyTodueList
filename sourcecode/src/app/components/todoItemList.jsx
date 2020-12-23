import React, {useState} from 'react'
import {
  Checkbox,
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  IconButton,
  InputBase,
  makeStyles,
  Typography,
  Card,
  Button,
  Box
} from '@material-ui/core';
import {
  AddCircleOutline as AddCircleOutlineIcon,
  ContactsOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon
} from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    
  },
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginTop: '10px',
    marginBottom: '10px',
    paddingTop: '0px',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    
  },
  expensionSummary: {
    position: 'relative',
    display: 'block',   
  
  },

  expansionPanelSummaryContent: {
    marginTop: '0px',
    marginBottom: '0px',
  
   
  },
  
  todoItemFormControl: {
    width: 'calc(100% - 180px)',
    height: '0 px',
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
    
  },

  



  optionButtonArea: {
    position: 'fixed',
    outline: '0 !important',
    padding: 0,

    // marginTop: '6px',
  },
  optionButtons: {
    outline: '0 !important',
    margin: 'auto',

  },
  dateField: {
    position: 'relative',
    outline: '0 !important',
    margin: 'auto',
    textAlign: 'right',
    marginRight: 15,
    marginTop: 0,
    border: '0px solid #ccc',
    padding: 0,
    borderRadius: 10,
    fontSize: '0.875rem',
  },

  
  
  rootButton: {
    display: 'flex',
    
  },
  paper: {
    marginRight: theme.spacing(1),
  },
  optionButtonPopper: {
    zIndex: 9
  },
  filterArea: {
    marginBottom: 10,
    
  },
  listTitle: {
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    backgroundColor: '#fff',
    marginRight: '10px',
    justifyContent: "right",
    borderRadius: 5,
    padding: '10px',

  },
  search: {
    position: 'relative',
    borderRadius: 5,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    marginRight: theme.spacing(2),
    marginLeft: 10,
    width: 250,
    justifyContent: "right",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    }
  },
  addTodoItemButton: {
    display: 'block',
    outline: '0 !important',
    margin: 'auto',
    marginTop: 5
  },
  addTodoItemButtonIcon: {
    color: '#3dd19d',
    fontSize: 30
  },

  addTaskButton: {
    color: '#3dd19d',
    fontSize: 15,
    border: "solid 1px #3dd19d",
    backgroundColor: "white",
  },


}));

function TodoItemList(props) {
  const classes = useStyles();
  let lists = props.list.todoList;
  let filteredLists;
  
  const [searchText, setSearchText] = useState('');
  const [sortCompleted, setSortCompleted] = useState(false);
  const [sortIncomplete, setSortIncomplete] = useState(false);  

  let remaining = []
  if(props.list.id){
    remaining = props.list.todoList.filter((list) => !list.isComplete);
  }
  else {remaining = []};
  

  let notRemaining = []
  if(props.list.id){
    notRemaining = props.list.todoList.filter((list) => list.isComplete);
  }
  else {notRemaining = []};

  let allTasks = []
  if(props.list.id){
    allTasks = props.list.todoList.filter((list) => list);
  }
  else {allTasks = []};

  let compRate = []
  if(props.list.id){
    compRate = props.list.todoList.filter((list) => list);
  }
  else {compRate = []};
  console.log(compRate);





  if (props.list.id) {
    if(sortCompleted){
      filteredLists = props.list.todoList.filter((list)=> list.isComplete);
    }
    else if(sortIncomplete){
      filteredLists = props.list.todoList.filter((list)=> !list.isComplete);
    }
    else filteredLists = props.list.todoList.filter((list) => list.name.toLowerCase().includes(searchText.toLocaleLowerCase()));
  } else {
    filteredLists = [];
  }
  
  const sortByAll = () => {
    setSortIncomplete(false);
    setSortCompleted(false);
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
    // Return Type -> DD.MM.YY  HH:MM
    const eventDate = new Date(time);
    const resDate = twoDigitDateTextMaker(eventDate.getUTCDate()) + '.' + twoDigitDateTextMaker(eventDate.getUTCMonth() + 1) + '.' + twoDigitDateTextMaker(eventDate.getUTCFullYear());
    const resClock = twoDigitDateTextMaker(eventDate.getHours()) + ':' + twoDigitDateTextMaker(eventDate.getMinutes());
    return {
      date: resDate,
      clock: resClock
    };
  }
  
  const editTodo = (event, list, index) => {
    event.stopPropagation();
    props.openEditDialog(list, index);
  }
  
  const removeTodo = (event, list, index) => {
    event.stopPropagation();
    lists.splice(index, 1);
    props.updateTodoList({name: props.list.name, todoList: lists});
  }
  
  const checkboxToggle = (event, list) => {
    event.stopPropagation();
    list.isComplete = !list.isComplete;
    props.updateTodoList({name: props.list.name, todoList: lists});
  }
  
  
  if (props.list.id) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        
        <div className={classes.filterAread}>
          
          <Box display="flex" mt={2}>
          <box>
            
            <Typography variant="h5" className={classes.listTitle}>{props.list.name}</Typography>
            </box>
            <Card elevation={2} style={{padding: "3px"}}>
            <Button color="black" onClick={sortByAll}>
                <Typography>All</Typography> <Typography variant="h6"><Typography style={{paddingLeft: '15px'}} display="inline" variant="h6" color="primary"> {allTasks.length}</Typography></Typography>
              </Button>
            
              <Button color="black" onClick={() => {setSortIncomplete(true) ; setSortCompleted(false)}}>
                <Typography>Todue</Typography> <Typography variant="h6"><Typography style={{paddingLeft: '5px'}} display="inline" variant="h6" color="primary"> {remaining.length}</Typography></Typography>
              </Button>
              <Button color="black" onClick={() => {setSortCompleted(true); setSortIncomplete(false)}}>
        
                <Typography>Todone</Typography> <Typography variant="h6"><Typography style={{paddingLeft: '5px'}} display="inline" variant="h6" color="primary"> {notRemaining.length}</Typography></Typography>

              </Button>
            </Card>
            <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon style={{color:"lightgreen"}}/>
            </div>
            <InputBase style={{marginTop:"10px"}}
              placeholder="Search your tasks…"
              onChange={(text) => {
                setSearchText(text.target.value)
              }}
              value={searchText}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{'aria-label': 'search'}}
            />

 

          </div>
          <Button variant="contained" className={classes.addTaskButton} color="primary" aria-label="edit"  onClick={(event) => {
          props.openNewTodoDialog();
        }}>
          Add task
        </Button>
          </Box>
          
        </div>

        {props.list.todoList.length > 0 &&
        <div className={classes.root}>
          {filteredLists.map((list, index) => {
            const fullDate = calculateFullDate(list.date);
            return (
              <ExpansionPanel key={index}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-label="Expand"
                  aria-controls="additional-actions1-content"
                  id="additional-actions1-header"
                  classes={{
                    content: classes.expansionPanelSummaryContent,
                  }}
                >
                
                {window.screen.availWidth<500 ? 
                    <span style={{display:"flex", flexDirection:"column"}}>
                    <FormControlLabel
                      className={classes.todoItemFormControl}
                      aria-label="Acknowledge"
                      onClick={(event) => {
                        checkboxToggle(event, list);
                      }}
                      onFocus={(event) => event.stopPropagation()}
                      control={<Checkbox checked={list.isComplete}/>}
                      label={list.name}
                      style={{maxWidth:"100px", minWidth: "100px", color:"black",}}
                    />
                    <span style={{display:"flex"}}>
                    <Typography className={classes.dateField}>
        
                      {fullDate.date}
                      <br/>
                      {fullDate.clock}
                    </Typography>
                    <IconButton aria-label="edit" className={classes.optionButtons} onClick={(event) => {
                      editTodo(event, list, index);
                    }}>
                      <EditIcon/>
                    </IconButton>
                    <IconButton aria-label="delete" className={classes.optionButtons} onClick={(event) => {
                      removeTodo(event, list, index);
                    }}>
                      <DeleteIcon/>
                    </IconButton>
                    </span>
                    </span>

                    :
                    <>
                    <FormControlLabel
                    className={classes.todoItemFormControl}
                    aria-label="Acknowledge"
                    onClick={(event) => {
                      checkboxToggle(event, list);
                    }}
                    onFocus={(event) => event.stopPropagation()}
                    control={<Checkbox checked={list.isComplete}/>}
                    label={list.name} />
                  <Typography className={classes.dateField}>
                  
                    {fullDate.date} {fullDate.clock}
                  
                    
                  </Typography>
                  <IconButton aria-label="edit" className={classes.optionButtons} onClick={(event) => {
                    editTodo(event, list, index);
                  }}>
                    <EditIcon/>
                  </IconButton>
                  <IconButton aria-label="delete" className={classes.optionButtons} onClick={(event) => {
                    removeTodo(event, list, index);
                  }}>
                    <DeleteIcon/>
                  </IconButton>
                  </>
              }                
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography color="textSecondary">
                    {list.detail}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </div>
        }
        {props.list.todoList.length === 0 &&
        <div>
          <h5 style={{textAlign: 'center', padding: 25}}>Add your first task to start getting things todone around here....</h5>
        </div>
        }
        <IconButton aria-label="edit" className={classes.addTodoItemButton} onClick={(event) => {
          props.openNewTodoDialog();
        }}>
          <AddCircleOutlineIcon className={classes.addTodoItemButtonIcon}/>
        </IconButton>
      </Container>
    );
  } else {
    return (
      <div>
        <h3 style={{textAlign: 'center', padding: 25}}>No saved Todue List found, please first add Todue from left menu.
        Add your list.</h3>
      </div>
    )
  }
}

export default TodoItemList;

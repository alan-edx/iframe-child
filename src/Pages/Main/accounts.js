import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import {
  MuiThemeProvider,
  makeStyles
} from '@material-ui/core/styles'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import theme from '../../@config/Theme'
import { getProfileUserData } from '../../actions/account'
import { getEncryptedCookie, handleLabelKEY } from '../../common/commonFunctions'
import { cookieKeys } from "../../common/constants"
import { getImageUrl } from '../../common/handleAmazonS3Image'
import Browse from '../../components/browse'
import Stamp from '../../components/stamp'
import StampPdf from '../../components/stampPdf'
// import { SearchComponent } from '../../components/searchComponent'
import { setLoading } from '../../store/loader/action'
import { setCurrentTab } from '../../store/tab/action'
import { onTabIndex } from '../../store/tabState/action'
import { onUserDetailsUpdate } from '../../store/user/action'
import Footer from '../common/Footer'
import Header from '../common/Header'
import { Search } from './search'
const BrowseIcon = getImageUrl('browse-icon.svg')
const ElectronicSignatureIcon = getImageUrl('signature.svg')
const StampIcon = getImageUrl('stamp-icon.svg')

const useStyles = makeStyles({
  stampProcess: {
    height: 'calc(100vh - 200px)',
    display: 'flex',
    alignItems: 'center',
    padding: '130px 20px 70px',
    flexDirection: 'column',
    maxWidth: 1050,
    margin: 'auto'
  },
  tabSection: {
    borderBottom: '2px solid #DADCE0',
    width: '100%',
    minHeight: 65
  },
  tabBtn: {
    width: 210,
    maxWidth: '100%',
    padding: 0,
    height: 65,
    borderRadius: '5px 5px 0 0',
    '&:hover': {
      backgroundColor: '#F8F8F8'
    }
  },
  tabMain: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'FontMedium'
  },
  tabTitle: {
    color: '#868686',
    fontSize: 18,
    fontFamily: 'LatoMedium',
    textTransform: 'none',
    marginLeft: 10
  },
  subscribeFaild: {
    padding: '10px',
    background: '#e67070',
    width: '100%',
    textAlign: 'center',
    marginBottom: '10px',
    borderRadius: '6px',
    color: '#fff'
  },
  comesoon: {
    textAlign: 'center',
    color: '#868686',
    fontSize: '18px',
    fontFamily: 'LatoMedium',
    marginLeft: '10px',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 300px)'
  },
  '@media screen and (max-width: 1024px)': {
    tabBtn: {
      width: 245
    }
  },
  '@media screen and (max-width: 768px)': {
    tabBtn: {
      width: 180
    }
  },
  '@media screen and (max-width: 767px)': {
    tabBtn: {
      width: 150
    }
  }
})

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <div>
          <Typography>{children}</Typography>
        </div>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export const Account = (props) => {
  const dispatch = useDispatch()
  // const history = useHistory()
  const classes = useStyles()
  // let link = props.location.pathname
  const cookieToken = getEncryptedCookie(cookieKeys.cookieUser);
  const { tabindex } = useSelector((state) => state.currentTab)
  const selected_Language = useSelector(
    (state) => state.labelsReducer.lang_
  )
  const adminlabelsFromReducer = useSelector(
    (state) => state.labelsReducer.labels
  )
  const userDataStringified = useSelector(
    (state) => state.userDetails.user
  )

  const userData = JSON.parse(userDataStringified)
  const [value, setValue] = useState(tabindex)
  const [display, setDisplay] = useState(true)
  const tabstate = useSelector((state) => state.tabstate)
  // useEffect(() => {
  //   if (link === '/pay/success' || link === '/pay/cancel') {
  //     setValue(4)
  //     dispatch(setCurrentTab(4))
  //   } else if (link.toLowerCase() === '/signing') {
  //     setValue(1)
  //     dispatch(setCurrentTab(1))
  //     history.replace('/account')
  //   } else if (link === '/account') {
  //     history.replace('/account')
  //   } else {
  //     history.replace('/account')
  //   }
  //   // eslint-disable-next-line
  // }, [link])

  useEffect(() => {
    if (tabstate.status) {
      setValue(tabstate.index)
      dispatch(setCurrentTab(tabstate.index))

      let data = {
        status: false,
        index: 0
      }
      dispatch(onTabIndex(data))
    }
    // eslint-disable-next-line
  }, [tabstate])

  const handleDisplay = () => {
    setDisplay(!display)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
    dispatch(setCurrentTab(newValue))
  }

  const handleTabChange = (newValue) => {
    setValue(newValue)
    dispatch(setCurrentTab(newValue))
  }
  useEffect(() => {
    if (!Object.keys(userData).viewType) {
      handleGetUser()
    }
  }, [])

  const handleGetUser = () => {
    dispatch(setLoading(true))
    getProfileUserData()
      .then((res) => {
        dispatch(onUserDetailsUpdate(JSON.stringify(res.data)))
        dispatch(setLoading(false))
      })
      .catch(() => {
        dispatch(setLoading(false))
      })
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <div className={classes.stampProcess}>
        <Tabs
          className={classes.tabSection}
          value={tabindex}
          onChange={handleChange}
          aria-label="stamp tab"
          variant="scrollable"
        >
          <Tab
            className={classes.tabBtn}
            label={
              <div className={classes.tabMain}>
                <img src={StampIcon} alt="StampIcon" />
                <Typography className={classes.tabTitle}>
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.add_stamp
                      : adminlabelsFromReducer?.DE?.add_stamp,
                    'Add Stamp'
                  )}
                </Typography>
              </div>
            }
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tabBtn}
            label={
              <div className={classes.tabMain}>
                <img
                  src={ElectronicSignatureIcon}
                  alt="ElectronicSignatureIcon"
                />
                <Typography className={classes.tabTitle}>
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN
                          ?.electronic_signature
                      : adminlabelsFromReducer?.DE
                          ?.electronic_signature,
                    'Electronic Signature'
                  )}
                </Typography>
              </div>
            }
            {...a11yProps(1)}
          />
          <Tab
            className={classes.tabBtn}
            label={
              <div className={classes.tabMain}>
                <img src={BrowseIcon} alt="BrowseIcon" />
                <Typography className={classes.tabTitle}>
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.browse
                      : adminlabelsFromReducer?.DE?.browse,
                    'Browse'
                  )}
                </Typography>
              </div>
            }
            {...a11yProps(2)}
          />
          <Tab
            className={classes.tabBtn}
            label={
              <div className={classes.tabMain}>
                <img src={BrowseIcon} alt="BrowseIcon" />
                <Typography className={classes.tabTitle}>
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.browse
                      : adminlabelsFromReducer?.DE?.browse,
                    'Validate'
                  )}
                </Typography>
              </div>
            }
            {...a11yProps(3)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Stamp stampSuccess={() => handleTabChange(2)} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <StampPdf stampSuccess={() => handleTabChange(2)} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Browse />
        </TabPanel>
        <TabPanel value={value} index={3}>
          {/* <SearchComponent /> */}
          <Search />
        </TabPanel>
      </div>
      <Footer />
    </MuiThemeProvider>
  )
}

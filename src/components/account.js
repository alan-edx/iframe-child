/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import {
  MuiThemeProvider,
  makeStyles
} from '@material-ui/core/styles'
import InfoIcon from '@material-ui/icons/Info'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../App.css'
import {
  downloadCertificateAction,
  getCredentialkey
} from '../actions/account'
import {
  handleLabelKEY,
  setEncryptedLocalStorage,
  toastSuccess
} from '../common/commonFunctions'
import { localStorageKeys } from '../common/constants'
import { getImageUrl } from '../common/handleAmazonS3Image'
import { environment } from '../environments/environment'
import { setLoading } from '../store/loader/action'
import { onUserDetailsUpdate } from '../store/user/action'
import {
  generateKeyOfApi,
  universeUserInfo
} from './generateKeyPostAPIIntegration'
const CopyContent = getImageUrl('content_copy.svg')

const useStyles = makeStyles({
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingBottom: 60,
    marginTop: 50
  },
  stampTitle: {
    fontFamily: 'LatoBold',
    fontSize: 22,
    color: '#0D0F12'
  },
  metaData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  addLink: {
    fontSize: 16,
    color: '#073D83',
    fontFamily: 'LatoBold',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  generateKey: {
    textDecoration: 'none',
    color: '#ffffff',
    backgroundColor: '#073D83',
    padding: '5px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'LatoBold',
    '&:hover': {
      textDecoration: 'none',
      color: '#ffffff'
    }
  },
  accountLabel: {
    fontSize: 14,
    color: '#4C4F53',
    fontFamily: 'LatoBold',
    marginBottom: 10
  },
  accountInfo: {
    marginBottom: 40
  },
  message: {
    fontSize: 16,
    fontFamily: 'Lato',
    marginBottom: 20,
    '& a': {
      fontFamily: 'LatoBold'
    }
  },
  group: {
    flexDirection: 'row'
  },
  disableInput: {
    background: '#F8F8F8',
    color: '#868686',
    '& input': {
      paddingRight: '60px'
    }
  },
  fieldSet: {
    '& fieldset': {
      top: '0px'
    }
  },
  clientwrapper: {
    position: 'relative'
  },
  copyicon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer'
  },
  exportBtn: {
    padding: '17px 40px',
    marginRight: 'auto',
    '&:hover': {
      backgroundColor: '#073D83'
    }
  },
  certificateSettingsTitleDiv: {
    display: 'flex'
  },

  pdfSettingsTitleDiv: {
    display: 'flex'
  },

  iIcon: {
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: '20px',
    color: '#9F9F9F',
    cursor: 'pointer'
  },
  arrow: {
    '&:before': {
      border: '2px solid #073D83'
    },
    color: '#073D83',
    marginTop: '50px'
  },
  tooltip: {
    backgroundColor: '#fff',
    border: '2px solid #073D83',
    boxShadow: '0px 2px 2px .5px #ccc',
    color: '#073D83',
    padding: '.7rem',
    borderRadius: '6px',
    fontSize: '14px'
  },
  '@media screen and (max-width: 767px)': {
    tabContent: {
      marginTop: 30,
      paddingBottom: 90
    },
    stampTitle: {
      fontSize: 20
    }
  }
})

function AccountTab() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const userDataStringified = useSelector(
    (state) => state.userDetails.user
  )
  const selected_Language = useSelector(
    (state) => state.labelsReducer.lang_
  )
  const adminlabelsFromReducer = useSelector(
    (state) => state.labelsReducer.labels
  )

  const [userData, setuserData] = useState({})
  const [credentialVal, setcredentialVal] = useState({})
  const [certificateView, setcertificateView] = useState(0)
  const [watermarkPosition, setWatermarkPosition] = useState('none')
  const [checked, setChecked] = useState(
    userData.watermark === 1 ? true : false
  )

  useEffect(() => {
    const userDataVal = JSON.parse(userDataStringified)
    setuserData(userDataVal)
    setChecked(userDataVal.watermark === 1 ? true : false)
    setcertificateView(userDataVal.viewType)
    setWatermarkPosition(userDataVal.align)
    dispatch(setLoading(true))
    getCredentialkey()
      .then((res) => {
        setcredentialVal(res.data)
        dispatch(setLoading(false))
      })
      .catch(() => {
        dispatch(setLoading(false))
      })
  }, [dispatch])

  const handleChangeWatermarkPostiton = (event) => {
    setWatermarkPosition(event.target.value)
    let postData = {
      align: event.target.value
    }
    updateAccountSetting(postData)
  }

  const handleChange = (event) => {
    let certificateViewVal = parseInt(event.target.value)
    setcertificateView(certificateViewVal)
    let postData = {
      viewType: certificateViewVal
    }
    updateAccountSetting(postData)
  }

  const updateAccountSetting = (postData) => {
    dispatch(setLoading(true))
    downloadCertificateAction(postData)
      .then((res) => {
        userData.viewType = res.data.viewType
        userData.watermark = res.data.watermark
        userData.align = res.data.align
        setEncryptedLocalStorage(
          localStorageKeys.isLoggedIn,
          JSON.stringify(userData)
        )
        setuserData(userData)
        dispatch(onUserDetailsUpdate(JSON.stringify(userData)))

        dispatch(setLoading(false))
      })
      .catch(() => {
        dispatch(setLoading(false))
      })
  }

  const generateKeyFn = () => {
    dispatch(setLoading(true))
    const postData = {
      applicationId: String(credentialVal.applicationId || 38),
      subscribe: 1
    }
    universeUserInfo()
      .then((res) => {
        if (res.status === 200) {
          generateKeyOfApi(postData)
            .then((res) => {
              const cred = credentialVal
              cred.clientId = res.data.data.clientId
              cred.secretKey = res.data.data.secretKey
              setcredentialVal(cred)
              dispatch(setLoading(false))
            })
            .catch(() => {
              dispatch(setLoading(false))
            })
        }
      })
      .catch((err) => {
        dispatch(setLoading(false))
      })
  }

  const handlerCopy = (val) => {
    navigator.clipboard.writeText(val)
    toastSuccess(
      handleLabelKEY(
        selected_Language === 'English'
          ? adminlabelsFromReducer?.EN?.copied
          : adminlabelsFromReducer?.DE?.copied,
        'Copied!'
      )
    )
  }

  return (
    <MuiThemeProvider>
      <div className={classes.tabContent}>
        <div className={classes.metaData}>
          <Typography className={classes.stampTitle}>
            {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.your_account
                : adminlabelsFromReducer?.DE?.your_account,
              'Your Account'
            )}
          </Typography>
          <Link
            href={`${environment.profileURL}`}
            className={classes.addLink}
          >
            {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.edit_account_information
                : adminlabelsFromReducer?.DE
                    ?.edit_account_information,
              'Edit Account Information'
            )}
          </Link>
        </div>
        <Grid container spacing={2} className={classes.accountInfo}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              color="secondary"
              className={classes.accountLabel}
            >
              {handleLabelKEY(
                selected_Language === 'English'
                  ? adminlabelsFromReducer?.EN?.full_name
                  : adminlabelsFromReducer?.DE?.full_name,
                'Full Name'
              )}
            </Typography>
            <TextField
              value={
                userData?.first_name
                  ? `${userData?.first_name} ${userData?.last_name}`
                  : userData.profileName
              }
              name="name"
              id="name"
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              color="secondary"
              className={classes.accountLabel}
            >
              {handleLabelKEY(
                selected_Language === 'English'
                  ? adminlabelsFromReducer?.EN?.email
                  : adminlabelsFromReducer?.DE?.email,
                'Email'
              )}
            </Typography>
            <TextField
              value={userData.email}
              name="email"
              id="email"
              type="email"
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
            />
          </Grid>
          {userData?.owner_org === true &&
            userData?.orgInfo?.name && (
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Typography
                  color="secondary"
                  className={classes.accountLabel}
                >
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.company
                      : adminlabelsFromReducer?.DE?.company,
                    'Company'
                  )}
                </Typography>
                <TextField
                  value={userData?.orgInfo?.name}
                  name="name"
                  id="name"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled
                />
              </Grid>
            )}
        </Grid>
        <Grid container spacing={2} className={classes.accountInfo}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div className={classes.certificateSettingsTitleDiv}>
              <Typography className={classes.stampTitle}>
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN
                        ?.certificate_blockchain_settings
                    : adminlabelsFromReducer?.DE
                        ?.certificate_blockchain_settings,
                  'Certificate Blockchain settings'
                )}
              </Typography>
              <Tooltip
                title={handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN
                        ?.choose_the_type_of_settings_to_view_the_certificate_info
                    : adminlabelsFromReducer?.DE
                        ?.choose_the_type_of_settings_to_view_the_certificate_info,
                  'Choose the type of settings to view the certificate info'
                )}
                arrow
                classes={{
                  arrow: classes.arrow,
                  tooltip: classes.tooltip
                }}
              >
                <InfoIcon className={classes.iIcon} />
              </Tooltip>
            </div>
            <RadioGroup
              // aria-label="Gender"
              name="certificateDownload"
              className={classes.group}
              value={certificateView}
              onChange={handleChange}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="PDF"
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="JSON"
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="None"
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={classes.accountInfo}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <div className={classes.certificateSettingsTitleDiv}>
              <Typography className={classes.stampTitle}>
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.watermark_position
                    : adminlabelsFromReducer?.DE?.watermark_position,
                  'Watermark Postiton'
                )}
              </Typography>
              <Tooltip
                title={handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN
                        ?.choose_the_type_of_position_for_pdf_watermark
                    : adminlabelsFromReducer?.DE
                        ?.choose_the_type_of_position_for_pdf_watermark,
                  'Choose the type of position for pdf watermark'
                )}
                arrow
                classes={{
                  arrow: classes.arrow,
                  tooltip: classes.tooltip
                }}
              >
                <InfoIcon className={classes.iIcon} />
              </Tooltip>
            </div>
            <RadioGroup
              name="certificateDownload"
              className={classes.group}
              value={watermarkPosition}
              onChange={handleChangeWatermarkPostiton}
            >
              <FormControlLabel
                value="top"
                control={<Radio />}
                label={handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.top
                    : adminlabelsFromReducer?.DE?.top,
                  'Top'
                )}
              />
              <FormControlLabel
                value="bottom"
                control={<Radio />}
                label={handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.bottom
                    : adminlabelsFromReducer?.DE?.bottom,
                  'Bottom'
                )}
              />
              <FormControlLabel
                value="none"
                control={<Radio />}
                label={handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.none
                    : adminlabelsFromReducer?.DE?.none,
                  'None'
                )}
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <div className={classes.metaData}>
          <Typography className={classes.stampTitle}>API</Typography>
        </div>
        <Typography color="secondary" className={classes.message}>
          {/* In order to use Our API, you will need the following credentials. */}
          To use our API and access the bStamp features, you'll need
          the following credentials:
          <li>
            <b style={{ textTransform: 'uppercase' }}>Client ID:</b>{' '}
            This uniquely identifies your account credentials.
          </li>
          <li>
            <b style={{ textTransform: 'uppercase' }}>Secret Key:</b>{' '}
            A secure key used for authentication.
          </li>
          You can generate multiple access keys for your convenience.
          {/* {handleLabelKEY(
            selected_Language === "English"
6              ? adminlabelsFromReducer?.EN?.you_will_need_the_following_credentials_in_order_to_use_our_api_please_visit_the_complete_document
              : adminlabelsFromReducer?.DE?.you_will_need_the_following_credentials_in_order_to_use_our_api_please_visit_the_complete_document,
            "You will need the following credentials in order to use Our API. Please visit the complete document"
          )} */}
          &nbsp;
          <span
            onClick={() =>
              window.open(
                `${environment.accountURL}/api-keys/create?client=bStamp`
              )
            }
            style={{
              color: '#073D83',
              cursor: 'pointer'
            }}
          >
            <b> Click here</b>

            {/* {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.here
                : adminlabelsFromReducer?.DE?.here,
              'here.'
            )} */}
          </span>{' '}
          <span>to generate new keys.</span>
        </Typography>
        <Typography color="secondary" className={classes.message}>
          If you would like to modify your profile information (or)
          security settings (or) and other personalization settings,
          then please click on{' '}
          <b style={{ textTransform: 'uppercase' }}>
            Edit account information.
          </b>
        </Typography>
      </div>
    </MuiThemeProvider>
  )
}

export default AccountTab

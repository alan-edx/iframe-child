import { Input, makeStyles, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import {
  createTheme,
  MuiThemeProvider
} from '@material-ui/core/styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import cryptojs from 'crypto-js'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { QRCode } from 'react-qrcode-logo'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { getHash } from '../../actions/account'
import {
  handleLabelKEY,
  toastSuccess
} from '../../common/commonFunctions'
import { toasterMessage } from '../../common/constants'
import { getImageUrl } from '../../common/handleAmazonS3Image'
import { environment } from '../../environments/environment'
import { setLoading } from '../../store/loader/action'
import { IRootReducer } from '../../store/root-reducer'
import Header from '../common/Header'
const CopyContent: any = getImageUrl('content_copy.svg')
const bStampIcon = getImageUrl('bstamp-icon.svg')
const stampInvalid = getImageUrl('bstamp-images/stamp-invalid.svg')

const theme: any = createTheme({
  palette: {
    primary: {
      main: '#073D83'
    },
    secondary: {
      main: '#868686'
    }
  },
  overrides: {
    MuiTypography: {
      colorTextPrimary: {
        color: '#56C75A'
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 10
      },
      input: {
        padding: 30,
        color: '#4C4F53',
        fontFamily: 'Lato',
        '&::placeholder': {
          color: '#868686',
          opacity: 1
        },
        '@media screen and (max-width: 767px)': {
          padding: 20
        }
      }
    },
    MuiButton: {
      contained: {
        boxShadow: 'none'
      }
    }
  }
})

const useStyles = makeStyles({
  profileMain: {
    padding: '70px 0 50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: 1090,
    margin: 'auto'
  },
  title: {
    fontSize: 40,
    color: '#0D0F12',
    fontWeight: 'bold',
    fontFamily: 'LatoBold',
    margin: '50px 0'
  },
  document: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap'
  },
  qrCode: {
    height: 195,
    width: 'auto',
    border: '1px solid #DADCE0',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 30,
    display: 'flex',
    alignItems: 'center'
  },
  codeDetail: {
    width: '79%'
  },
  codeTitle: {
    fontSize: 22,
    margin: 0,
    fontFamily: 'LatoBold',
    marginBottom: 10,
    color: '#0D0F12'
  },
  codeSection: {
    background: '#073D83',
    padding: '35px 30px',
    borderRadius: 5,
    position: 'relative',
    marginBottom: 10
  },
  code: {
    color: '#fff',
    fontFamily: 'LatoBold',
    width: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  copyIcon: {
    position: 'absolute',
    right: 30,
    top: 35,
    color: '#fff',
    padding: 0
  },
  codeDescription: {
    fontSize: 14,
    fontFamily: 'Lato'
  },
  information: {
    margin: '50px 0 0',
    width: '100%'
  },
  infoDetail: {
    padding: '0 20px',
    border: '1px solid #DADCE0',
    borderRadius: 10
  },
  infoRow: {
    padding: '20px 0',
    borderBottom: '1px solid rgb(218, 220, 224)',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  infoName: {
    fontFamily: 'LatoBold',
    fontSize: 14,
    textTransform: 'uppercase',
    color: '#4C4F53'
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Lato',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& a': {
      textDecoration: 'underline'
    }
  },
  certificate: {
    width: '100%'
  },
  certificateInput: {
    position: 'relative'
  },
  downloadBtn: {
    height: 70,
    width: 260,
    position: 'absolute',
    top: 4,
    right: 5,
    color: '#fff',
    borderRadius: 5,
    fontFamily: 'LatoMedium',
    textTransform: 'capitalize',
    fontSize: 18,
    '&:hover': {
      backgroundColor: '#073D83'
    }
  },
  bottom: {
    width: '100%'
  },
  bottomLink: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    fontFamily: 'LatoBold',
    fontSize: 14,
    marginTop: 50,
    '&:hover': {
      color: '#073D83',
      textDecoration: 'none'
    }
  },
  downloadMobile: {
    display: 'none',
    padding: 0,
    position: 'absolute',
    top: 20,
    right: 20
  },
  invalidHash: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: 30,
    fontFamily: 'LatoBold'
  },
  copyIconSort: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer'
  },
  stampInvalidDiv: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  },

  stampInvalidImg: {
    marginBottom: '2%'
  },
  validateFile: {
    fontWeight: 600,
    cursor: 'pointer'
  },

  docVal: {
    borderRadius: '5px',
    padding: '10px',
    width: '100%',
    color: '#073d83',
    marginTop: '10px',
    fontSize: '16px',
    lineHeight: '26px',
    background: '#e8f0fe',
    '& a': {
      color: '#073d83',
      textDecoration: 'none',
      fontWeight: '700'
    }
  },

  invalidTitle: {
    fontSize: '27px',
    fontWeight: 900,
    color: '#0D0F12',
    margin: '2% 0%'
  },

  stampinvalidPara: {
    color: '#868686',
    fontSize: '14px'
  },

  statusLabel: {
    padding: '0px 10px',
    color: '#fff',
    background: 'hsl(205deg 97% 48%)',
    borderRadius: 11,
    textTransform: 'uppercase',
    fontSize: 11,
    float: 'right'
  },

  '@media screen and (max-width: 1024px)': {
    profileMain: {
      padding: '70px 20px 50px'
    },
    title: {
      margin: '30px 0'
    },
    codeDetail: {
      width: '76%'
    }
  },
  '@media screen and (max-width: 768px)': {
    qrCode: {
      marginRight: 20
    },
    codeDetail: {
      width: '70%'
    }
  },
  '@media screen and (max-width: 767px)': {
    profileMain: {
      maxWidth: '100%'
    },
    qrCode: {
      marginRight: 0
    },
    title: {
      fontSize: 22,
      margin: '15px 0'
    },
    document: {
      justifyContent: 'center'
    },
    codeDetail: {
      width: '100%',
      textAlign: 'center'
    },
    codeSection: {
      padding: 15
    },
    codeTitle: {
      fontSize: 18
    },
    copyIcon: {
      top: 15,
      right: 15
    },
    information: {
      margin: '20px 0'
    },
    downloadBtn: {
      display: 'none'
    },
    downloadMobile: {
      display: 'block'
    },
    bottomLink: {
      marginTop: 25
    }
  },

  '@media screen and (max-width: 414px)': {
    stampInvalidDiv: {
      width: '100%'
    }
  }
})

export const Profile = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()

  const location: any = useParams()
  const search: any = useLocation()?.search

  const selected_Language = useSelector(
    (state: IRootReducer) => state?.labelsReducer?.lang_
  )
  const adminlabelsFromReducer = useSelector(
    (state: IRootReducer) => state?.labelsReducer?.labels
  )

  const [hashData, sethashData]: any = useState({})
  const [hashMetaData, sethashMetaData]: any = useState([])
  const [isLoader, setisLoader] = useState(false)
  const [isResponse, setisResponse] = useState(false)
  const queryParams = new URLSearchParams(search).get('pdf')
  const [pdfStamp, setPdfStamp] = useState(false)
  const [stampValidateHash, setStampValidateHash] = useState('')

  const copyHash = (e: string) => {
    navigator.clipboard.writeText(e)
    toastSuccess(toasterMessage.copied)
  }

  const handleDrop = async (files: any) => {
    setisLoader(true)
    let file = files?.target?.files[0]
    let generateFileHash = new Promise((resolve, reject) => {
      try {
        var reader: any = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          let base64 = reader.result.split(',')[1]
          let hashVal = cryptojs.SHA256(base64).toString()
          resolve(hashVal)
          resolve(hashVal)
        }
        reader.onerror = function () {
          reject(toasterMessage.somethingWentWrong)
        }
      } catch (e) {
        reject(toasterMessage.somethingWentWrong)
      }
    })

    generateFileHash.then((result: any) => {
      setStampValidateHash(result)
      setisLoader(false)
    })
  }

  useEffect(() => {
    const parmasVal = {
      id: location.id
    }
    if (queryParams && queryParams === 'yes') {
      setPdfStamp(true)
    } else {
      setPdfStamp(false)
    }
    setisLoader(true)
    dispatch(setLoading(true))
    getHash(parmasVal)
      .then((response: any) => {
        sethashData(response.data)
        setisResponse(true)
        dispatch(setLoading(false))
        setisLoader(false)
        if (response.data.metaData.length) {
          let objectVal = response.data.metaData[0]
          var result = Object.keys(objectVal).map((key) => [
            key,
            objectVal[key]
          ])
          sethashMetaData(result)
        }
      })
      .catch((err) => {
        setisResponse(false)
        setisLoader(false)
        dispatch(setLoading(false))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.id, dispatch])

  const handleStringify = (value: string) => {
    if (typeof value !== 'string') {
      return JSON.stringify(value)
    }
    return value
  }

  return (
    <MuiThemeProvider theme={theme}>
      <>
        <Header />
        {!isLoader && isResponse && (
          <div className={classes.profileMain}>
            <h1 className={classes.title}>Stamped Document</h1>
            <div className={classes.document}>
              <div className={classes.qrCode}>
                <QRCode
                  value={`${environment.DOMAINUrl}${location?.id}${
                    hashData?.isEsign ? '?pdf=yes' : ''
                  }`}
                  ecLevel="M"
                  size={160}
                  logoImage={bStampIcon}
                  logoWidth={6 * 6}
                  qrStyle="squares"
                  fgColor="#161616"
                />
              </div>
              <div className={classes.codeDetail}>
                <Typography className={classes.codeTitle}>
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN
                          ?.document_hash_imprint
                      : adminlabelsFromReducer?.DE
                          ?.document_hash_imprint,
                    'Document hash imprint'
                  )}
                </Typography>
                <div className={classes.codeSection}>
                  <p className={classes.code}>{hashData.hash}</p>
                  <IconButton
                    className={classes.copyIcon}
                    onClick={(e) => copyHash(`hash_${hashData.hash}`)}
                  >
                    <FileCopyOutlinedIcon />
                  </IconButton>
                </div>
                <Typography
                  color="secondary"
                  className={classes.codeDescription}
                >
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.the_document_named
                      : adminlabelsFromReducer?.DE
                          ?.the_document_named,
                    'The document named '
                  )}{' '}
                  <b>{hashData.filename}</b>{' '}
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN
                          ?.has_been_stamped_via_our_service_on_the_blockchain
                      : adminlabelsFromReducer?.DE
                          ?.has_been_stamped_via_our_service_on_the_blockchain,
                    'has been stamped via our service on the blockchain.'
                  )}
                </Typography>
              </div>
            </div>
            {pdfStamp && (
              <>
                <p className={classes.docVal}>
                  <i
                    className={'fas fa-info-circle'}
                    style={{ fontSize: '15px', margin: '0px 5px' }}
                  ></i>{' '}
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN
                          ?.please_use_our_validate_function_for_double_assurance
                      : adminlabelsFromReducer?.DE
                          ?.please_use_our_validate_function_for_double_assurance,
                    'Please use our validate function for double-assurance. '
                  )}
                  <label
                    className={classes.validateFile}
                    htmlFor="hashValidate"
                  >
                    {handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.try_validate
                        : adminlabelsFromReducer?.DE?.try_validate,
                      'Try Validate'
                    )}
                  </label>
                  <Input
                    id="hashValidate"
                    name="hashValidate"
                    placeholder="123.jpg"
                    type="file"
                    className="d-none"
                    onChange={(event) => handleDrop(event)}
                  />
                  {stampValidateHash && (
                    <label
                      className={classes.statusLabel}
                      style={
                        hashData.hash !== stampValidateHash &&
                        hashData.originalDocHash !== stampValidateHash
                          ? { background: '#EA2027' }
                          : {}
                      }
                    >
                      {hashData.hash === stampValidateHash ||
                      hashData.originalDocHash === stampValidateHash
                        ? 'Signed & Stamped'
                        : 'Not Stamped'}
                    </label>
                  )}
                </p>
                {stampValidateHash && (
                  <p className={classes.docVal}>
                    {hashData.hash === stampValidateHash ||
                    hashData.originalDocHash === stampValidateHash
                      ? handleLabelKEY(
                          selected_Language === 'English'
                            ? adminlabelsFromReducer?.EN
                                ?.this_document_has_not_been_modified_since_it_was_certified_in_edexa_universe_blockchain_no_other_changes_on_this_document_are_permitted_the_sign_identity_is_valid
                            : adminlabelsFromReducer?.DE
                                ?.this_document_has_not_been_modified_since_it_was_certified_in_edexa_universe_blockchain_no_other_changes_on_this_document_are_permitted_the_sign_identity_is_valid,
                          'This document has not been modified since it was certified in edeXa Universe Blockchain. No other changes on this document are permitted. The sign identity is valid.'
                        )
                      : handleLabelKEY(
                          selected_Language === 'English'
                            ? adminlabelsFromReducer?.EN
                                ?.this_document_is_not_stamped_or_it_has_been_modified_this_sign_identity_is_not_valid_and_rejected_by_edexa_universe_blockchain
                            : adminlabelsFromReducer?.DE
                                ?.this_document_is_not_stamped_or_it_has_been_modified_this_sign_identity_is_not_valid_and_rejected_by_edexa_universe_blockchain,
                          'This document is not stamped or it has been modified. This sign identity is not Valid and rejected by edeXa Universe Blockchain'
                        )}
                  </p>
                )}
              </>
            )}
            <div className={classes.information}>
              <Typography className={classes.codeTitle}>
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.file_information
                    : adminlabelsFromReducer?.DE?.file_information,
                  'File Information'
                )}
              </Typography>
              <div className={classes.infoDetail}>
                <Grid container className={classes.infoRow}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Typography
                      color="secondary"
                      className={classes.infoName}
                    >
                      {handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.short_code
                          : adminlabelsFromReducer?.DE?.short_code,
                        'SHORT CODE'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={9} lg={9}>
                    <div style={{ display: 'flex' }}>
                      <Typography
                        color="textPrimary"
                        className={classes.infoValue}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => copyHash(hashData.code)}
                      >
                        {hashData.code}
                      </Typography>
                      <img
                        src={CopyContent}
                        alt="CopyContent"
                        style={{ cursor: 'pointer' }}
                        onClick={() => copyHash(hashData.code)}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container className={classes.infoRow}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Typography
                      color="secondary"
                      className={classes.infoName}
                    >
                      TRANSACTION ID
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={9} lg={9}>
                    <div style={{ display: 'flex' }}>
                      <Typography
                        color="secondary"
                        className={classes.infoValue}
                      >
                        {hashData.txid}
                      </Typography>
                      <img
                        src={CopyContent}
                        alt="CopyContent"
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          copyHash(`tx_${hashData.txid}`)
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container className={classes.infoRow}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Typography
                      color="secondary"
                      className={classes.infoName}
                    >
                      TIMESTAMP
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={7} lg={7}>
                    <Typography
                      color="secondary"
                      className={classes.infoValue}
                    >
                      {moment(hashData.timestamp).format(
                        'MMMM Do YYYY, h:mm:ss a'
                      )}{' '}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.infoRow}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Typography
                      color="secondary"
                      className={classes.infoName}
                    >
                      {handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.status
                          : adminlabelsFromReducer?.DE?.status,
                        'status'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={7} lg={7}>
                    <Typography
                      color="textPrimary"
                      className={classes.infoValue}
                    >
                      {hashData.isEsign
                        ? 'Signed & Stamped'
                        : 'Stamped'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={classes.infoRow}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Typography
                      color="secondary"
                      className={classes.infoName}
                    >
                      Stored On
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={7} lg={7}>
                    {hashData?.isPrivateBc ? (
                      <Typography
                        color="secondary"
                        className={classes.infoValue}
                      >
                        Private Blockchain
                      </Typography>
                    ) : (
                      <Typography
                        color="secondary"
                        className={classes.infoValue}
                        style={{
                          cursor: 'pointer'
                        }}
                        onClick={() =>
                          window.open(
                            `${environment.appsDomain.explorerDomain}/tx/${hashData.txid}`
                          )
                        }
                      >
                        Public Blockchain
                        <OpenInNewIcon
                          style={{
                            fontSize: '18px',
                            marginLeft: '10px'
                          }}
                          fontSize="small"
                        />
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </div>
            </div>
            {hashMetaData.length > 0 && (
              <div className={classes.information}>
                <Typography className={classes.codeTitle}>
                  {' '}
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.meta_information
                      : adminlabelsFromReducer?.DE?.meta_information,
                    'Meta Information'
                  )}
                </Typography>
                <div className={classes.infoDetail}>
                  {hashMetaData.map((val: any, index: any) => {
                    return (
                      <Grid
                        container
                        className={classes.infoRow}
                        key={index}
                      >
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                          <Typography
                            color="secondary"
                            className={classes.infoName}
                          >
                            {val[0]}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={7} lg={7}>
                          <Typography
                            color="secondary"
                            className={classes.infoValue}
                          >
                            {handleStringify(val[1])}
                          </Typography>
                        </Grid>
                      </Grid>
                    )
                  })}
                </div>
              </div>
            )}
            <div className={classes.information}>
              <Typography className={classes.codeTitle}>
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.owner_information
                    : adminlabelsFromReducer?.DE?.owner_information,
                  'Owner Information'
                )}
              </Typography>
              <div className={classes.infoDetail}>
                <Grid container className={classes.infoRow}>
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Typography
                      color="secondary"
                      className={classes.infoName}
                    >
                      {handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.name
                          : adminlabelsFromReducer?.DE?.name,
                        'Name'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={7} lg={7}>
                    <Typography
                      color="secondary"
                      className={classes.infoValue}
                    >
                      {hashData.username}
                      {hashData.userVerify === 1 && (
                        <>
                          <CheckCircle
                            style={{
                              color: 'rgb(7, 61, 131)',
                              fontSize: '15px',
                              marginLeft: '10px'
                            }}
                            fontSize="small"
                          />

                          <span
                            style={{
                              color: 'rgb(7, 61, 131)',
                              fontSize: '12px',
                              fontWeight: 700
                            }}
                          >
                            {handleLabelKEY(
                              selected_Language === 'English'
                                ? adminlabelsFromReducer?.EN?.verified
                                : adminlabelsFromReducer?.DE
                                    ?.verified,
                              'Verified'
                            )}
                          </span>
                        </>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className={classes.bottom}>
              <Link
                href="/"
                color="secondary"
                className={classes.bottomLink}
              >
                <KeyboardBackspaceIcon
                  fontSize="small"
                  style={{ margin: '0 2px 0 0' }}
                />
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.back_to_homepage
                    : adminlabelsFromReducer?.DE?.back_to_homepage,
                  'BACK TO HOMEPAGE'
                )}
              </Link>
            </div>
          </div>
        )}
        {!isLoader && !isResponse && (
          <>
            <div className={classes.stampInvalidDiv}>
              <img
                onClick={() => history.goBack()}
                src={stampInvalid}
                alt="Stamp Invalid"
                width="45px"
                height="45px"
                className={classes.stampInvalidImg}
              />

              <h2 className={classes.invalidTitle}>
                Stamp is Invalid
              </h2>
              <p className={classes.stampinvalidPara}>
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN
                        ?.your_stamp_is_invalid_please_recheck_the_hash__shortcode_or_file_which_you_have_searched
                    : adminlabelsFromReducer?.DE
                        ?.your_stamp_is_invalid_please_recheck_the_hash__shortcode_or_file_which_you_have_searched,
                  'Your stamp is invalid. Please recheck the Hash / shortcode or file which you have searched.'
                )}
              </p>
            </div>
          </>
        )}
      </>
    </MuiThemeProvider>
  )
}

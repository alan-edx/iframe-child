/* eslint-disable no-unused-vars */
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import {
  createTheme,
  makeStyles,
  MuiThemeProvider
} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import cryptojs from 'crypto-js'
import { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { addStampe, getProfileUserData } from '../actions/account'
import {
  getBase64FromFile,
  handleLabelKEY,
  setEncryptedLocalStorage,
  toastError,
  toastSuccess
} from '../common/commonFunctions'
import {
  localStorageKeys,
  maxFileSize,
  metaDataKeyValueLimit
} from '../common/constants'
import { getImageUrl } from '../common/handleAmazonS3Image'
import { environment } from '../environments/environment'
import { getAdminLanguageLabels } from '../store/Labels/action'
import { setLoading } from '../store/loader/action'
import { onUserDetailsUpdate } from '../store/user/action'
import StampModal from './stampModal'
const Delete = getImageUrl('delete.svg')

const theme = createTheme({
  palette: {
    primary: {
      main: '#073D83'
    },
    secondary: {
      main: '#868686'
    }
  },
  overrides: {
    MuiTab: {
      root: {
        opacity: '1 !important',
        zIndex: 1
      }
    },
    PrivateTabIndicator: {
      root: {
        height: '100%',
        backgroundColor: '#DADCE0 !important',
        borderRadius: '5px 5px 0 0'
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '16px 20px',
        color: '#4C4F53',
        fontFamily: 'Lato',
        '&::placeholder': {
          color: '#868686',
          opacity: 1
        }
      },
      notchedOutline: {
        borderRadius: 5
      }
    },
    PrivateNotchedOutline: {
      root: {
        top: 0
      }
    }
  }
})

const useStyles = makeStyles({
  textUp: {
    textTransform: 'uppercase'
  },
  firstStamp: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    height: 'calc(100vh - 280px)'
  },
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
  stampDescription: {
    fontSize: 20,
    fontFamily: 'Lato',
    margin: '20px 0 40px'
  },
  addBtn: {
    width: 180,
    height: 55,
    padding: 0,
    borderRadius: 5,
    fontFamily: 'Lato',
    fontSize: 16
  },
  dropZone: {
    background: '#F8F8F8',
    border: '2px dashed #dadce0',
    borderRadius: 10,
    width: '100%',
    textAlign: 'center',
    padding: '65px 0',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none'
    }
  },
  stampText: {
    marginBottom: 50,
    fontSize: '14px',
    marginTop: '10px'
  },
  dragFile: {
    fontSize: 20
  },
  metadata: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  addLink: {
    fontSize: 16,
    color: '#073D83',
    fontFamily: 'LatoBold',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  stampData: {
    padding: '20px 20px',
    textAlign: 'center',
    borderRadius: 10,
    border: '1px solid #dadce0'
  },
  dataList: {
    display: 'flex',
    width: '100%',
    marginBottom: 20,
    '&:last-child': {
      marginBottom: 0
    }
  },
  stampBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 50
  },
  actionBtn: {
    padding: '15px 40px',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'LatoBold',
    '&:hover': {
      backgroundColor: '#073D83',
      color: '#fff'
    }
  },
  labelData: {
    width: '30%',
    marginRight: 10
  },
  labelDescription: {
    width: '65%',
    marginRight: 10
  },
  selectType: {
    width: '25%',
    marginRight: 10,
    color: '#4C4F53'
  },
  deleteBtn: {
    minWidth: 0,
    width: 57,
    padding: 15,
    border: '1px solid #dadce0',
    '&:hover': {
      backgroundColor: '#DADCE0',
      border: '1px solid #dadce0',
      '& svg': {
        color: 'red'
      }
    }
  },
  deleteIcon: {
    width: 16
  },
  deleteName: {
    display: 'none'
  },
  '@media screen and (max-width: 767px)': {
    tabContent: {
      marginTop: 30,
      paddingBottom: 90
    },
    dropZone: {
      marginBottom: 30
    },
    stampTitle: {
      fontSize: 20
    },
    labelData: {
      width: '100%',
      margin: '0 0 10px'
    },
    selectType: {
      width: '100%',
      margin: '0 0 10px'
    },
    labelDescription: {
      width: '100%',
      margin: '0 0 10px'
    },
    dataList: {
      flexWrap: 'wrap'
    },
    stampBtn: {
      justifyContent: 'center',
      marginTop: 10
    },
    actionBtn: {
      fontSize: 14,
      padding: '10px 30px'
    },
    deleteBtn: {
      width: '100%'
    },
    deleteIcon: {
      marginTop: '-3px'
    },
    deleteName: {
      display: 'block',
      marginLeft: 10
    }
  }
})

function Stamp({ stampSuccess }) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const adminlabelsFromReducer = useSelector(
    (state) => state.labelsReducer.labels
  )
  const userDataStringified = useSelector(
    (state) => state.userDetails.user
  )
  const selected_Language = useSelector(
    (state) => state.labelsReducer.lang_
  )
  const userData = JSON.parse(userDataStringified)
  const [fileNames, setFileNames] = useState('')
  const [metaData, setMetaData] = useState([])
  const [viewMetaData, setViewMetaData] = useState([])
  const [isDisabled, setisDisabled] = useState(true)
  const [isPdfFile, setisPdfFile] = useState({})
  const [savePosition, setsavePosition] = useState(1)
  const [isBlockchainPrivate, setIsBlockchainPrivate] = useState(true)
  const [file, setFile] = useState()
  const [modal, setModal] = useState({
    status: false,
    type: ''
  })
  const [alignVal, setAlignVal] = useState(
    userData.align === 'none' ? 'top' : userData.align
  )

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0])
    const metaDataObject = []
    const viewMetaObject = []
    setisPdfFile({})
    dispatch(setLoading(true))
    let fileName = acceptedFiles.map((file) => file.name)[0]
    if (acceptedFiles[0].size > maxFileSize) {
      toastError(
        handleLabelKEY(
          selected_Language === 'English'
            ? adminlabelsFromReducer?.EN
                ?.maximum_allowed_file_size_is_100_mb
            : adminlabelsFromReducer?.DE
                ?.maximum_allowed_file_size_is_100_mb,
          'Maximum allowed file size is 100 MB'
        )
      )
      dispatch(setLoading(false))
      return false
    } else {
      setFileNames(fileName)
      const file = {
        label: 'filename',
        val: fileName
      }
      getBase64FromFile(acceptedFiles[0]).then((result) => {
        if (result) {
          let base64 = result.split(',')[1]
          let hashVal = cryptojs.SHA256(base64).toString()
          const hashValue = {
            label: 'hash',
            val: hashVal
          }
          metaDataObject.push(file, hashValue)
          setMetaData(metaDataObject)
          viewMetaObject.push(file, hashValue)
          setViewMetaData(viewMetaObject)
          setisDisabled(false)
          dispatch(setLoading(false))
        }
      })
    }
  }

  useEffect(() => {
    let socket = io(environment.APIBASEURL, {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    })
    socket.on('language_labels', (data) => {
      dispatch(getAdminLanguageLabels(data))
    })
    return () => {
      socket.off('language_labels')
      socket.removeAllListeners()
      socket.close()
    }
    // eslint-disable-next-line
  }, [])

  const addMetaData = () => {
    const intializeObject = {
      label: '',
      val: ''
    }
    setMetaData([...metaData, intializeObject])
    setViewMetaData([...viewMetaData, intializeObject])
    setisDisabled(true)
  }

  const addStamp = () => {
    const formData = new FormData()
    metaData.forEach((element) => {
      formData.append(element.label, element.val)
    })
    formData.append('isPrivate', isBlockchainPrivate)
    formData.append('type', '1')
    dispatch(setLoading(true))
    addStampe(formData)
      .then((res) => {
        setMetaData([])
        setFileNames('')
        stampSuccess()
        setEncryptedLocalStorage(
          localStorageKeys.isLoggedIn,
          JSON.stringify(userData)
        )
        dispatch(onUserDetailsUpdate(JSON.stringify(userData)))
        toastSuccess(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN
                  ?.document_stamped_successfully
              : adminlabelsFromReducer?.DE
                  ?.document_stamped_successfully,
            'Document stamped successfully'
          )
        )
        if (res.data.base64)
          downloadurl(res.data.base64, res.data.filename)
        dispatch(setLoading(false))
      })
      .catch(() => {
        dispatch(setLoading(false))
      })
  }

  const getAlignPostion = (alignVal, savePosi) => {
    setAlignVal(alignVal)
    setsavePosition(savePosi ? 1 : 0)
    handleModalClose()
  }

  const downloadurl = (contentBase64, name) => {
    const linkSource = `${contentBase64}`
    const downloadLink = document.createElement('a')
    document.body.appendChild(downloadLink)
    downloadLink.href = linkSource
    downloadLink.target = '_self'
    downloadLink.download = name
    downloadLink.click()
  }

  const onDelete = (index) => {
    const metaDataval = [...metaData]
    metaDataval.splice(index, 1)
    setMetaData(metaDataval)

    const metaDataval1 = [...viewMetaData]
    metaDataval1.splice(index, 1)
    setViewMetaData(metaDataval1)

    let filterArray = metaDataval.filter(
      (val) => !val.label || !val.val
    )
    if (filterArray.length || !fileNames) {
      setisDisabled(true)
    } else {
      setisDisabled(false)
    }
  }

  const handleModalClose = () => {
    setModal({
      status: false,
      type: ''
    })
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.tabContent}>
        <div className={classes.metadata}>
          <Typography
            component={'span'}
            className={classes.stampTitle}
          >
            {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.stamp_your_document
                : adminlabelsFromReducer?.DE?.stamp_your_document,
              'Stamp your document'
            )}
          </Typography>
        </div>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div className={classes.dropZone} {...getRootProps()}>
              <input {...getInputProps()} />
              {fileNames ? (
                <Typography
                  component={'span'}
                  color="secondary"
                  className={classes.dragFile}
                >
                  {fileNames}
                </Typography>
              ) : (
                <Typography
                  component={'span'}
                  color="secondary"
                  className={classes.dragFile}
                >
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN
                          ?.drop_your_files_or_click_here
                      : adminlabelsFromReducer?.DE
                          ?.drop_your_files_or_click_here,
                    'Drop your files, or click here'
                  )}
                </Typography>
              )}
            </div>
          )}
        </Dropzone>
        <Typography color="secondary" className={classes.stampText}>
          {handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN
                  ?.your_document_will_get_stamped_in
              : adminlabelsFromReducer?.DE
                  ?.your_document_will_get_stamped_in,
            'Your document will get stamped in'
          )}
          <b> Blockchain.</b>
        </Typography>

        <Typography className={classes.stampTitle}>
          Blockchain Settings
        </Typography>
        <p style={{ color: '#868686' }}>
          <strong>
            {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.note
                : adminlabelsFromReducer?.DE?.note,
              'Note:'
            )}
          </strong>{' '}
          {isBlockchainPrivate
            ? 'Your file will be stamped in private Blockchain'
            : 'Your file will be stamped in public Blockchain'}
        </p>

        {/* Do Not Remove the below commented out code.. as this commented only for now */}

        <Switch
          checked={isBlockchainPrivate}
          color="primary"
          onChange={(e) => setIsBlockchainPrivate(e.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
        />

        {modal.status && (
          <StampModal
            display={modal.status}
            getAlignPostion={getAlignPostion}
            handleModalClose={handleModalClose}
            fileData={file}
            alignVAL={alignVal}
          />
        )}
        {viewMetaData.length > 0 && (
          <>
            <div className={classes.metadata}>
              <Typography
                component={'span'}
                className={classes.stampTitle}
              >
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.stamp_metadata
                    : adminlabelsFromReducer?.DE?.stamp_metadata,
                  'Stamp MetaData'
                )}
              </Typography>
              {viewMetaData.length < 7 && (
                <Link
                  className={classes.addLink}
                  onClick={addMetaData}
                >
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.add_metadata
                      : adminlabelsFromReducer?.DE?.add_metadata,
                    'Add Metadata'
                  )}
                </Link>
              )}
            </div>
            <div className={classes.stampData}>
              {userData.watermark === 1 && isPdfFile.size && (
                <div className={classes.dataList}>
                  <TextField
                    placeholder={handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.ex_label
                        : adminlabelsFromReducer?.DE?.ex_label,
                      'ex. Label'
                    )}
                    name="label"
                    id="label"
                    variant="outlined"
                    color="secondary"
                    value="Watermark Position"
                    disabled="true"
                    className={classes.labelData}
                  />
                  <TextField
                    placeholder={handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.description
                        : adminlabelsFromReducer?.DE?.description,
                      'Description'
                    )}
                    name="description"
                    id="description"
                    variant="outlined"
                    color="secondary"
                    value={alignVal}
                    disabled="true"
                    className={`${classes.labelDescription} ${classes.textUp}`}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.deleteBtn}
                    onClick={() =>
                      setModal({
                        status: true,
                        type: ''
                      })
                    }
                  >
                    <i
                      className={`far fa-edit ${classes.deleteIcon} `}
                      style={{ fontSize: '18px' }}
                    ></i>
                    <span className={classes.deleteName}>Delete</span>
                  </Button>
                </div>
              )}
              {viewMetaData.length ? (
                viewMetaData.map((meta, index) => (
                  <div key={index} className={classes.dataList}>
                    <TextField
                      placeholder={handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.ex_label
                          : adminlabelsFromReducer?.DE?.ex_label,
                        'ex. Label'
                      )}
                      name="label"
                      id="label"
                      variant="outlined"
                      color="secondary"
                      value={meta.label}
                      inputProps={{
                        maxLength: metaDataKeyValueLimit.label
                      }}
                      className={classes.labelData}
                      disabled={
                        meta.label === 'filename' ||
                        meta.label === 'hash'
                      }
                      onChange={(e) => {
                        const data = [...metaData]
                        data[index].label = e.target.value.trimStart()
                        setMetaData(data)
                        const data1 = [...viewMetaData]
                        data1[index].label =
                          e.target.value.trimStart()
                        setViewMetaData(data1)
                        let filterArray1 = viewMetaData.filter(
                          (val) => !val.label || !val.val
                        )
                        if (filterArray1.length || !fileNames) {
                          setisDisabled(true)
                        } else {
                          setisDisabled(false)
                        }
                      }}
                    />
                    <TextField
                      placeholder={handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.description
                          : adminlabelsFromReducer?.DE?.description,
                        'Description'
                      )}
                      name="description"
                      id="description"
                      variant="outlined"
                      color="secondary"
                      value={meta.val}
                      inputProps={{
                        maxLength: metaDataKeyValueLimit.value
                      }}
                      className={classes.labelDescription}
                      disabled={
                        meta.label === 'filename' ||
                        meta.label === 'hash'
                      }
                      onChange={(e) => {
                        const data = [...metaData]
                        data[index].val = e.target.value.trimStart()
                        setMetaData(data)
                        const data1 = [...viewMetaData]
                        data1[index].val = e.target.value.trimStart()
                        setViewMetaData(data1)
                        let filterArray1 = viewMetaData.filter(
                          (val) => !val.label || !val.val
                        )
                        if (filterArray1.length || !fileNames) {
                          setisDisabled(true)
                        } else {
                          setisDisabled(false)
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => onDelete(index)}
                      disabled={
                        meta.label === 'filename' ||
                        meta.label === 'hash'
                      }
                      className={classes.deleteBtn}
                    >
                      <img
                        src={Delete}
                        alt="Delete"
                        className={classes.deleteIcon}
                      />
                      <span className={classes.deleteName}>
                        {handleLabelKEY(
                          selected_Language === 'English'
                            ? adminlabelsFromReducer?.EN?.delete
                            : adminlabelsFromReducer?.DE?.delete,
                          'Delete'
                        )}
                      </span>
                    </Button>
                  </div>
                ))
              ) : (
                <Typography
                  component={'span'}
                  color="secondary"
                  style={{ fontSize: 14 }}
                >
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN
                          ?.not_added_any_metadata_click_add_metadata
                      : adminlabelsFromReducer?.DE
                          ?.not_added_any_metadata_click_add_metadata,
                    'Not added any metadata, click Add Metadata'
                  )}
                </Typography>
              )}
            </div>
            {metaData.length < 7 && (
              <Typography
                component={'span'}
                color="secondary"
                style={{ fontSize: 14, marginTop: 10 }}
              >
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN
                        ?.you_can_add_more_information_by_clicking_on
                    : adminlabelsFromReducer?.DE
                        ?.you_can_add_more_information_by_clicking_on,
                  'You can add more information by clicking on'
                )}
                <b>
                  {' '}
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.add_metadata
                      : adminlabelsFromReducer?.DE?.add_metadata,
                    'Add Metadata'
                  )}
                </b>
              </Typography>
            )}
          </>
        )}
        <div className={classes.stampBtn}>
          <Button
            className={classes.actionBtn}
            color="primary"
            variant="contained"
            disabled={isDisabled}
            onClick={addStamp}
          >
            stamp
          </Button>
        </div>
      </div>
    </MuiThemeProvider>
  )
}

export default Stamp

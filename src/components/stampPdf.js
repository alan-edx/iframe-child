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
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { addStampe } from '../actions/account'
import {
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
    color: '#0D0F12',
    marginTop: '20px'
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
    justifyContent: 'flex-end'
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

function StampPdf({ stampSuccess }) {
  const classes = useStyles()
  const dispatch = useDispatch()

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

  const [isBlockchainPrivate, setIsBlockchainPrivate] = useState(true)
  const [fileNames, setFileNames] = useState('')
  const [metaData, setMetaData] = useState([])
  const [viewMetaData, setViewMetaData] = useState([])
  const [isDisabled, setisDisabled] = useState(true)
  const [isFileData, setisFileData] = useState({})
  const [savePosition, setsavePosition] = useState(1)
  const [file, setFile] = useState()
  const [isPdf, setIsPdf] = useState(false)
  const [modal, setModal] = useState({
    status: false,
    type: ''
  })
  const [alignVal, setAlignVal] = useState(
    userData.align === 'none' ? 'top' : userData.align
  )
  const [XMLValue, setXMLValue] = useState('')

  const handleDrop = (acceptedFiles) => {
    if (
      !acceptedFiles ||
      acceptedFiles.length === 0 ||
      !acceptedFiles[0].type
    ) {
      return toastError('Only PDF or XML files allowed!')
    }
    if (
      acceptedFiles[0].type !== 'application/pdf' &&
      acceptedFiles[0].type !== 'text/xml'
    ) {
      return toastError('Only PDF or XML files allowed!')
    }
    setFile(acceptedFiles[0])
    const metaDataObject = []
    const viewMetaObject = []
    setisFileData({})
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
      let xmlData = new Promise(async (resolve, reject) => {
        try {
          var reader = new FileReader()
          reader.readAsText(acceptedFiles[0])
          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = function (error) {}
        } catch (e) {
          reject(false)
        }
      })
      xmlData.then((result) => {
        if (result) {
          setXMLValue(result)
        }
      })
      setisFileData(acceptedFiles[0])
      if (acceptedFiles[0].type === 'application/pdf') {
        setIsPdf(true)
        setModal({
          status: true,
          type: ''
        })
      } else {
        setIsPdf(false)
      }
      setFileNames(fileName)
      const file = {
        label: 'filename',
        val: fileName
      }
      let getBase64 = new Promise(async (resolve, reject) => {
        try {
          var reader = new FileReader()
          reader.readAsDataURL(acceptedFiles[0])
          reader.onload = function () {
            resolve(reader.result)
          }
          reader.onerror = function (error) {}
        } catch (e) {
          reject(false)
        }
      })
      getBase64.then((result) => {
        if (result) {
          let base64 = result.split(',')[1]
          let hashVal = cryptojs.SHA256(base64).toString()
          const hashValue = {
            label: 'hash',
            val: hashVal
          }

          let hashValData = {}
          if (acceptedFiles[0].type === 'application/pdf') {
            hashValData = {
              label: 'hash',
              val: 'PDF File with stamp'
            }
          } else {
            hashValData = {
              label: 'hash',
              val: 'XML File with stamp'
            }
          }
          metaDataObject.push(file, hashValue)
          setMetaData(metaDataObject)
          viewMetaObject.push(file, hashValData)
          setViewMetaData(viewMetaObject)
          setisDisabled(false)
          dispatch(setLoading(false))
          if (
            (userData.align === 'none' &&
              acceptedFiles[0].type === 'application/pdf') ||
            isPdf
          ) {
            setModal({
              status: true,
              type: ''
            })
          }
        }
      })
    }
  }
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
    formData.append('type', '1')
    formData.append('isPrivate', isBlockchainPrivate)
    if (isFileData.size && isPdf) {
      formData.append('align', alignVal)
      formData.append('attachments', isFileData)
      formData.append('savePreference', savePosition)
    } else {
      formData.append('attachments', isFileData)
    }
    dispatch(setLoading(true))
    addStampe(formData)
      .then((res) => {
        setMetaData([])
        setFileNames('')
        stampSuccess()
        if (!savePosition) {
          userData.align = 'none'
        } else {
          userData.align = alignVal
        }
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
  const handleChangeWaterMark = (event) => {}

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
          {!isPdf && viewMetaData.length > 0 && (
            <>
              <Link
                className={classes.addLink}
                onClick={() =>
                  setModal({
                    status: true,
                    type: ''
                  })
                }
              >
                XML{' '}
                {handleLabelKEY(
                  selected_Language === 'English'
                    ? adminlabelsFromReducer?.EN?.view
                    : adminlabelsFromReducer?.DE?.view,
                  'View'
                )}
              </Link>
            </>
          )}
        </div>
        <Dropzone accept=".pdf, .xml" onDrop={handleDrop}>
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
        {modal.status && (
          <StampModal
            display={modal.status}
            getAlignPostion={getAlignPostion}
            handleModalClose={handleModalClose}
            fileData={file}
            XMLValue={XMLValue}
            isPdf={isPdf}
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
              {isPdf && (
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
                    color="default"
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
                style={{
                  fontSize: 14,
                  marginTop: 10,
                  marginBottom: 40
                }}
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
        <Typography className={classes.stampTitle}>
          {handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN?.electronic_signature
              : adminlabelsFromReducer?.DE?.electronic_signature,
            'Electronic Signature'
          )}
        </Typography>
        <p style={{ color: '#868686' }}>
          {' '}
          <strong>
            {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.note
                : adminlabelsFromReducer?.DE?.note,
              'Note:'
            )}
          </strong>
          {handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN
                  ?.the_file_stamp_feature_will_be_enabled_for_any_type_of_file
              : adminlabelsFromReducer?.DE
                  ?.the_file_stamp_feature_will_be_enabled_for_any_type_of_file,
            'The file stamp feature will be enabled for PDF or XML file.'
          )}
        </p>

        {/* <Switch checked={true} color="primary" onChange={handleChangeWaterMark} inputProps={{ "aria-label": "controlled" }} /> */}

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

export default StampPdf

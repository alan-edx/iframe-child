/* eslint-disable no-unused-vars */
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {
  MuiThemeProvider,
  createTheme,
  makeStyles
} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress
} from 'reactstrap'
import { addStampe } from '../actions/account'
import {
  checkIfStringIsOnlyWhiteSpace,
  handleLabelKEY,
  toastError,
  toastSuccess
} from '../common/commonFunctions'
import { getImageUrl } from '../common/handleAmazonS3Image'
import { sendFileHashArray } from '../store/fileHashArray/action'
import { MetaDataPopupComponent } from './metaDataPopup'
import StampValidationSwitch from './stampValidationSwitch'
const CopyContent = getImageUrl('content_copy.svg')
const CancelDisabled = getImageUrl('cancel-disabled.svg')
const Cancel = getImageUrl('cancel-blue.svg')

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
        border: 'none',
        borderRadius: 5
      }
    }
  }
})

const useStyles = makeStyles({
  electronicSignature: {
    padding: '7px 6px',
    background: '#048EF1',
    borderRadius: 12,
    marginLeft: 6,
    '& p': {
      fontSize: 12,
      color: '#fff'
    }
  },
  stampButton: {
    padding: '10px 30px',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'LatoBold',
    backgroundColor: '#073D83',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#073D83',
      color: '#fff'
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
    backgroundColor: '#073D83',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#073D83',
      color: '#fff'
    },
    '&:disabled': {
      backgroundColor: 'rgb(0 0 0 / 12%)'
    }
  },
  stampProcess: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: 1320,
    margin: 'auto'
  },
  tabContent: {
    display: 'flex',
    justifyContent: 'center',
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
  browseData: {
    border: '1px solid #DADCE0',
    borderRadius: 10,
    overflow: 'hidden'
  },
  searchBar: {
    background: '#dadce0',
    padding: 10
  },
  searchInput: {
    background: '#fff',
    width: '100%',
    borderRadius: 5
  },
  tableHeader: {
    fontFamily: 'LatoBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#0D0F12',
    zIndex: 1
  },
  statusLabel: {
    padding: '3px 10px',
    color: '#fff',
    background: '#28C76F',
    borderRadius: 11,
    textTransform: 'uppercase',
    fontSize: 11
  },
  tableData: {
    fontSize: 15,
    fontFamily: 'Lato',
    color: '#4C4F53'
  },
  tableProgressbar: {
    maxWidth: '150px',
    height: 20,
    margin: 'auto'
  },
  tableBtn: {
    fontSize: 13,
    fontFamily: 'Lato',
    color: '#4C4F53',
    textTransform: 'capitalize',
    padding: 0,
    minWidth: 0,
    '& span': {
      margin: '0 10px'
    },
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  cancelBtn: {
    width: 'auto',
    padding: 0,
    height: 25,
    background: 'none',
    border: 'none',
    marginLeft: 5,
    '& img': {
      height: '100%'
    }
  },
  sortLink: {
    color: '#073D83',
    fontWeight: '600'
  },
  totalStamp: {
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'Lato',
    marginTop: 5
  },
  dialogPaper: {
    minHeight: '30vh'
  },
  boxJson: {
    border: '1px solid #ddd',
    margin: '0px 20px',
    borderRadius: '4px',
    color: '#e83e8c'
  },
  closeicon: {
    float: 'right',
    cursor: 'pointer'
  },
  copyicon: {
    position: 'absolute',
    top: '73px',
    right: '40px',
    cursor: 'pointer'
  },
  trackVertical: {
    right: 0,
    top: 0,
    height: '100% !important',
    width: '2px !important',
    '& div': {
      backgroundColor: '#073D83 !important',
      width: '2px !important'
    }
  },

  '@media screen and (max-width: 1194px)': {
    stampProcess: {
      maxWidth: 936
    },
    actionBtn: {
      padding: '10px 15px'
    }
  },

  '@media screen and (max-width: 992px)': {
    stampProcess: {
      maxWidth: 720
    }
  },

  '@media screen and (max-width: 767px)': {
    tabContent: {
      marginTop: 30,
      paddingBottom: 90
    },
    stampProcess: {
      maxWidth: 720
    },
    stampTitle: {
      fontSize: 20
    },
    metaData: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    buttons: {
      textAlign: 'right',
      width: '100%'
    },
    actionBtn: {
      padding: '5px 10px'
    }
  },

  '@media screen and (max-width: 576px)': {
    stampProcess: {
      maxWidth: 540
    }
  }
})

export const StampValidation = ({
  stampListRef,
  processingQueue,
  setProcessingQueue
}) => {
  const history = useHistory()
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
  const { fileHash } = useSelector((state) => state.fileHashArray)
  const { isLoggedIn } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIN
  }))

  const userData = JSON.parse(userDataStringified)

  const [open, setOpen] = useState(false)
  const [metaDataStateForPopup, setMetaDataStateForPopup] = useState(
    []
  )
  const [metaDataPopupOpen, setMetaDataPopupOpen] = useState({
    state: true
  })
  const [stampButtonPopupDisabled, setStampButtonPopupDisabled] =
    useState(false)
  const [electricSignature, setElectricSignature] = useState(false)
  useEffect(() => {
    if (fileHash.length === 0) {
      history.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileHash])
  const [jsonDetail, setJsonDetail] = useState({})

  const handleClose = () => {
    setOpen(false)
  }

  const handlerCopy = (val) => {
    navigator.clipboard.writeText(val)
    toastSuccess(
      handleLabelKEY(
        selected_Language === 'English'
          ? adminlabelsFromReducer?.DE?.copied
          : adminlabelsFromReducer?.DE?.copied,
        'Copied!'
      )
    )
  }

  const viewCerificate = (hash) => {
    window.open('/' + `hash_${hash}`, '_blank')
  }

  const classes = useStyles()

  const deleteStamp = (index) => {
    fileHash.splice(index, 1)
    dispatch(sendFileHashArray(fileHash))
  }

  const multiFileAddStamp = () => {
    //  if user is logged in & unstamped files are grater than 1, show the label
    if (isLoggedIn) {
      // filter out un-stamped files and start processing them
      const unStampedFiles = fileHash
        .map((file, index) => {
          return { data: file, index }
        })
        .filter((hash) => !hash.data.stamped)
      // loop asynchronously and add requests in queue one by one for stamp

      setProcessingQueue(true)
      let result = unStampedFiles.reduce(
        async (previousPromise, file) => {
          await previousPromise
          return addStamp(file.data, file.index)
        },
        Promise.resolve()
      )

      result
        .then(() => {
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
          setProcessingQueue(false)
        })
        .catch(() => {
          setProcessingQueue(false)
        })
    } else {
      toastError(
        handleLabelKEY(
          selected_Language === 'English'
            ? adminlabelsFromReducer?.EN
                ?.youneedtologintoaccessthisfeature
            : adminlabelsFromReducer?.DE
                ?.youneedtologintoaccessthisfeature,
          'You need to login to access this feature'
        )
      )
    }
  }

  const downloadPdf = (data) => {
    const a = document.createElement('a')
    a.href = data.base64
    a.download = data.filename
    a.click()
  }

  const addStamp = async (row, index) => {
    return new Promise((resolve, reject) => {
      if (!isLoggedIn) {
        reject(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN
                  ?.youneedtologintoaccessthisfeature
              : adminlabelsFromReducer?.DE
                  ?.youneedtologintoaccessthisfeature,
            'You need to login to access this feature'
          )
        )
        return toastError(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN
                  ?.youneedtologintoaccessthisfeature
              : adminlabelsFromReducer?.DE
                  ?.youneedtologintoaccessthisfeature,
            'You need to login to access this feature'
          )
        )
      }
      try {
        const formData = new FormData()
        formData.append('filename', row.file.name)
        formData.append('hash', row.hash)
        formData.append('type', '1')
        formData.append('isPrivate', row.isPrivate)
        fileHash[index].isload = true
        dispatch(sendFileHashArray(fileHash))
        addStampe(formData)
          .then((response) => {
            fileHash[index].isload = false
            fileHash[index].stamped = true
            dispatch(sendFileHashArray(fileHash))
            resolve()
          })
          .catch(() => {
            fileHash[index].isload = false
            dispatch(sendFileHashArray(fileHash))
            setProcessingQueue(false)
          })
      } catch (e) {
        reject(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN?.somethingwentwrong
              : adminlabelsFromReducer?.DE?.somethingwentwrong,
            'Something went wrong!'
          )
        )
        setProcessingQueue(false)
        fileHash[index].isload = false
        dispatch(sendFileHashArray(fileHash))
      }
    })
  }

  const checkUnstampedPDFFiles = () => {
    const unStampedPdfFiles = fileHash
      .filter((file) => !file.stamped)
      .filter(
        (element) =>
          element?.file?.type === 'application/pdf' ||
          element?.file?.type === 'text/xml'
      )
    if (
      unStampedPdfFiles &&
      unStampedPdfFiles?.length &&
      unStampedPdfFiles.length > 1
    ) {
      return (
        <>
          <Button
            className={classes.tableBtn}
            disabled={processingQueue}
            style={
              processingQueue
                ? {
                    marginLeft: 10,
                    background: '#737C88',
                    color: '#fff'
                  }
                : {
                    background: '#073D83',
                    color: '#fff',
                    marginLeft: 10
                  }
            }
            onClick={() =>
              addMultipleElectricSignature(unStampedPdfFiles)
            }
          >
            <img src={''} alt="" className="fas fa-file-signature" />
            &nbsp;&nbsp;
            <p>Add Electronic Signature</p>
          </Button>
          <Button
            className={classes.tableBtn}
            disabled={processingQueue}
            style={
              processingQueue
                ? {
                    marginLeft: 10,
                    background: '#737C88',
                    color: '#fff',
                    marginRight: 10
                  }
                : {
                    background: '#073D83',
                    color: '#fff',
                    marginLeft: 10,
                    marginRight: 10
                  }
            }
            onClick={() =>
              addElectricSignatureWithMetaData(
                unStampedPdfFiles,
                null
              )
            }
          >
            <img src={''} alt="" className="fas fa-file-contract" />
            &nbsp;&nbsp;
            <p>Add Electronic Signature with MetaData</p>
          </Button>
        </>
      )
    } else {
      return null
    }
  }

  const addToStampLabel = () => {
    // filter out un-stamped files and start processing them
    const unstampedFileCount = fileHash.filter(
      (file) => !file.stamped
    ).length
    // loop asynchronously and add requests in queue one by one for stamp
    if (unstampedFileCount > 1) {
      return (
        <>
          {checkUnstampedPDFFiles()}
          <Button
            className={classes.tableBtn}
            disabled={processingQueue}
            style={
              processingQueue
                ? {
                    background: '#737C88',
                    color: '#fff'
                  }
                : {
                    background: '#073D83',
                    color: '#fff'
                  }
            }
            onClick={multiFileAddStamp}
          >
            <img src={''} alt="" className="fas fa-stamp" />
            &nbsp;&nbsp;
            <p>Stamp All</p>
          </Button>
          <Button
            className={classes.tableBtn}
            disabled={processingQueue}
            style={
              processingQueue
                ? {
                    marginLeft: 10,
                    background: '#737C88',
                    color: '#fff'
                  }
                : {
                    background: '#073D83',
                    color: '#fff',
                    marginLeft: 10
                  }
            }
            onClick={() => {
              let newdata = fileHash.map((data, i) => {
                if (!data.stamped) {
                  return { ...data, index: i }
                }
                return null
              })
              onAddMetaData(newdata, false, null)
            }}
          >
            <img src={''} alt="" className="fas fa-table" />
            &nbsp;&nbsp;
            <p>Stamp All with Metadata</p>
          </Button>
        </>
      )
    }
  }

  const handleClearAll = () => {
    dispatch(sendFileHashArray([]))
  }

  const onAddMetaData = (data, isElectronicSignature, index) => {
    if (isLoggedIn) {
      let transformedArray = data.map((element) => {
        let data = [
          {
            label: 'filename',
            value: element?.file?.name
          },
          {
            label: 'hash',
            value: element?.hash
          },
          {
            label: '',
            value: ''
          }
        ]
        if (isElectronicSignature) {
          data.splice(2, 0, {
            label: 'Watermark Position',
            value:
              userData.align.toLowerCase() === 'none'
                ? 'top'
                : userData.align
          })
          setElectricSignature(true)
        }
        return {
          data,
          file: element.file,
          processing: false,
          stamped: false,
          isPrivate: element.isPrivate,
          index: index !== null ? index : element?.index
        }
      })
      setMetaDataStateForPopup(transformedArray)
      setMetaDataPopupOpen({ state: true })
    } else {
      toastError(
        handleLabelKEY(
          selected_Language === 'English'
            ? adminlabelsFromReducer?.EN
                ?.youneedtologintoaccessthisfeature
            : adminlabelsFromReducer?.DE
                ?.youneedtologintoaccessthisfeature,
          'You need to login to access this feature'
        )
      )
    }
  }

  const addClearAll = () => {
    if (fileHash.length > 1) {
      return (
        <Tooltip
          title={handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN?.clear_all
              : adminlabelsFromReducer?.DE?.clear_all,
            'Clear All'
          )}
        >
          <button
            className={classes.cancelBtn}
            disabled={processingQueue}
            onClick={handleClearAll}
          >
            <img
              src={processingQueue ? CancelDisabled : Cancel}
              alt="cancel"
            />
          </button>
        </Tooltip>
      )
    }
  }

  const closeMetaDataPopup = (triggerProcessing) => {
    // check if all fields are entered
    let isValid = true
    if (triggerProcessing) {
      // eslint-disable-next-line
      stop: for (let i = 0; i <= metaDataStateForPopup.length; i++) {
        for (
          let j = 0;
          j < metaDataStateForPopup[i]?.data?.length;
          j++
        ) {
          if (
            metaDataStateForPopup[i]?.data[j]?.label === '' ||
            checkIfStringIsOnlyWhiteSpace(
              metaDataStateForPopup[i]?.data[j]?.label
            ) ||
            metaDataStateForPopup[i]?.data[j]?.value === '' ||
            checkIfStringIsOnlyWhiteSpace(
              metaDataStateForPopup[i]?.data[j]?.value
            )
          ) {
            toastError(
              handleLabelKEY(
                selected_Language === 'English'
                  ? adminlabelsFromReducer?.EN
                      ?.pleasefillmissingfields
                  : adminlabelsFromReducer?.DE
                      ?.pleasefillmissingfields,
                'Please fill missing fields'
              )
            )
            isValid = false
            break stop
          }
        }
      }
      if (isValid) {
        setMetaDataPopupOpen({ state: false })

        handleMetaDataWithStampAfterPopupClose(metaDataStateForPopup)
      }
    } else {
      setMetaDataPopupOpen({ state: false })
      setElectricSignature(false)
    }
  }

  const handleMetaDataWithStampAfterPopupClose = (data) => {
    // check if any entry is empty
    setProcessingQueue(true)
    let result = data.reduce(async (previousPromise, meta, index) => {
      await previousPromise
      return addStampAfterMetaDataPopup(meta, index)
    }, Promise.resolve())
    result
      .then(() => {
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
        setProcessingQueue(false)
        setElectricSignature(false)
      })
      .catch(() => {
        setProcessingQueue(false)
        setElectricSignature(false)
      })
  }

  const addStampAfterMetaDataPopup = async (meta) => {
    return new Promise((resolve, reject) => {
      if (!isLoggedIn) {
        reject(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN
                  ?.youneedtologintoaccessthisfeature
              : adminlabelsFromReducer?.DE
                  ?.youneedtologintoaccessthisfeature,
            'You need to login to access this feature'
          )
        )
        return toastError(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN
                  ?.youneedtologintoaccessthisfeature
              : adminlabelsFromReducer?.DE
                  ?.youneedtologintoaccessthisfeature,
            'You need to login to access this feature'
          )
        )
      }
      try {
        const formData = new FormData()
        meta.data.forEach((el) => {
          if (el.label === 'Watermark Position') {
            formData.append('align', el.value)
          } else {
            formData.append(el.label, el.value)
          }
        })
        if (electricSignature) {
          formData.append('savePreference', 1)
        }
        formData.append('type', '1')

        if (
          userData.watermark === 1 &&
          (meta.file.type === 'application/pdf' ||
            meta.file.type === 'text/xml')
        ) {
          formData.append('attachments', meta.file)
        }
        const targetElement = fileHash.find(
          (el) => el.hash === meta.data[1].value
        )
        const index = fileHash.indexOf(targetElement)
        fileHash[index]['isload'] = true
        dispatch(sendFileHashArray(fileHash))
        addStampe(formData)
          .then((response) => {
            fileHash[index]['isload'] = false
            fileHash[index]['stamped'] = true
            if (electricSignature) {
              fileHash[index]['isEsign'] = true
            }
            dispatch(sendFileHashArray(fileHash))

            if (response?.data?.base64) {
              downloadPdf(response.data)
            }
            resolve()
          })
          .catch((e) => {
            fileHash[index]['isload'] = false
            dispatch(sendFileHashArray(fileHash))
            setProcessingQueue(false)
          })
      } catch (e) {
        reject(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN?.somethingwentwrong
              : adminlabelsFromReducer?.DE?.somethingwentwrong,
            'Something went wrong!'
          )
        )
      }
    })
  }
  const [blockChainType, setBlockChainType] = useState(false)
  const addElectricSignature = (row, index) => {
    return new Promise((resolve, reject) => {
      try {
        const formData = new FormData()
        formData.append('filename', row.file.name)
        formData.append('hash', row.hash)
        formData.append('type', 1)
        formData.append('attachments', row.file)
        formData.append('align', userData.align)
        formData.append('savePreference', 1)
        formData.append('isPrivate', row.isPrivate)

        fileHash[index].isload = true
        dispatch(sendFileHashArray(fileHash))
        addStampe(formData)
          .then((res) => {
            fileHash[index].isload = false
            fileHash[index].stamped = true
            fileHash[index].isEsign = true
            dispatch(sendFileHashArray(fileHash))
            // download file
            const linkSource = res.data.base64
            const downloadLink = document.createElement('a')
            const fileName = res.data.filename
            downloadLink.href = linkSource
            downloadLink.download = fileName
            downloadLink.click()
            resolve()
          })
          .catch(() => {
            fileHash[index].isload = false
            dispatch(sendFileHashArray(fileHash))
            setProcessingQueue(false)
            reject(
              handleLabelKEY(
                selected_Language === 'English'
                  ? adminlabelsFromReducer?.EN?.somethingwentwrong
                  : adminlabelsFromReducer?.DE?.somethingwentwrong,
                'Something went wrong!'
              )
            )
          })
      } catch (e) {
        reject(
          handleLabelKEY(
            selected_Language === 'English'
              ? adminlabelsFromReducer?.EN?.somethingwentwrong
              : adminlabelsFromReducer?.DE?.somethingwentwrong,
            'Something went wrong!'
          )
        )
        fileHash[index].isload = false
        dispatch(sendFileHashArray(fileHash))
        setProcessingQueue(false)
      }
    })
  }

  const addElectricSignatureWithMetaData = (dataArray, index) => {
    onAddMetaData(dataArray, true, index)
  }

  const addMultipleElectricSignature = (unStampedPdfFiles) => {
    if (isLoggedIn) {
      if (unStampedPdfFiles && unStampedPdfFiles.length > 0) {
        setProcessingQueue(true)
        let result = unStampedPdfFiles.reduce(
          async (previousPromise, file) => {
            let index = fileHash.findIndex(
              (element) => element.hash === file.hash
            )
            await previousPromise
            return addElectricSignature(file, index)
          },
          Promise.resolve()
        )

        result
          .then(() => {
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
            setProcessingQueue(false)
          })
          .catch((error) => {
            setProcessingQueue(false)
            toastError(error)
          })
      }
    } else {
      setProcessingQueue(false)
      toastError(
        handleLabelKEY(
          selected_Language === 'English'
            ? adminlabelsFromReducer?.EN
                ?.youneedtologintoaccessthisfeature
            : adminlabelsFromReducer?.DE
                ?.youneedtologintoaccessthisfeature,
          'You need to login to access this feature'
        )
      )
    }
  }

  return (
    <div className={classes.stampProcess} ref={stampListRef}>
      <MuiThemeProvider theme={theme}>
        <div className={classes.tabContent}>
          <div className={classes.metaData}>
            <Typography className={classes.stampTitle}>
              Stamp Status
            </Typography>
            <div className={classes.buttons}>
              {addToStampLabel()}
              {addClearAll()}
            </div>
          </div>
          <div className={classes.browseData}>
            <Scrollbars
              style={{ width: '100%' }}
              autoHide
              autoHeight
              autoHeightMin={0}
              autoHeightMax={430}
              renderTrackVertical={(props) => (
                <div {...props} className={classes.trackVertical} />
              )}
            >
              <Table
                stickyHeader
                className={classes.table}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader}>
                      {handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.filename_caps
                          : adminlabelsFromReducer?.DE?.filename_caps,
                        'FileName'
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHeader}
                    >
                      {handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.status_small
                          : adminlabelsFromReducer?.DE?.status_small,
                        'status'
                      )}
                    </TableCell>
                    <TableCell
                      className={classes.tableHeader}
                      align="center"
                      style={{ minWidth: 200 }}
                    >
                      {handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.actions_small
                          : adminlabelsFromReducer?.DE?.actions_small,
                        'actions'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileHash?.length ? (
                    fileHash.map((row, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell
                            title={row?.file?.name}
                            className={classes.tableData}
                          >
                            {row?.file?.name?.length > 50
                              ? row?.file?.name?.substring(0, 50) +
                                '...'
                              : row?.file?.name}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.tableData}
                          >
                            <label
                              className={classes.statusLabel}
                              style={
                                !row.stamped
                                  ? { background: '#EA2027' }
                                  : row.isEsign
                                  ? { background: '#048EF1' }
                                  : {}
                              }
                            >
                              {row.stamped ? (
                                row.isEsign ? (
                                  <>
                                    {handleLabelKEY(
                                      selected_Language === 'English'
                                        ? adminlabelsFromReducer?.EN
                                            ?.signed_stamped
                                        : adminlabelsFromReducer?.DE
                                            ?.signed_stamped,
                                      'signed & stamped'
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {handleLabelKEY(
                                      selected_Language === 'English'
                                        ? adminlabelsFromReducer?.EN
                                            ?.stamped
                                        : adminlabelsFromReducer?.DE
                                            ?.stamped,
                                      'stamped'
                                    )}
                                  </>
                                )
                              ) : (
                                <>
                                  {handleLabelKEY(
                                    selected_Language === 'English'
                                      ? adminlabelsFromReducer?.EN
                                          ?.not_stamped
                                      : adminlabelsFromReducer?.DE
                                          ?.not_stamped,
                                    'Not Stamped'
                                  )}
                                </>
                              )}
                            </label>
                          </TableCell>

                          <TableCell
                            className={classes.tableData}
                            align="center"
                          >
                            {row.isload ? (
                              <Progress
                                value={100}
                                animated={true}
                                className={classes.tableProgressbar}
                              >
                                <p
                                  style={{
                                    fontWeight: 700,
                                    fontSize: 14
                                  }}
                                >
                                  {handleLabelKEY(
                                    selected_Language === 'English'
                                      ? adminlabelsFromReducer?.EN
                                          ?.processing
                                      : adminlabelsFromReducer?.DE
                                          ?.processing,
                                    'Processing'
                                  )}
                                  ...
                                </p>
                              </Progress>
                            ) : (
                              <>
                                {row.stamped ? (
                                  <>
                                    <Button
                                      className={classes.tableBtn}
                                      onClick={() =>
                                        viewCerificate(row.hash)
                                      }
                                      disabled={processingQueue}
                                      style={{ maxWidth: '25px' }}
                                    >
                                      <Tooltip
                                        title={handleLabelKEY(
                                          selected_Language ===
                                            'English'
                                            ? adminlabelsFromReducer
                                                ?.EN?.view
                                            : adminlabelsFromReducer
                                                ?.DE?.view,
                                          'View'
                                        )}
                                      >
                                        <i
                                          className={'fas fa-eye'}
                                          style={{ fontSize: '15px' }}
                                        ></i>
                                      </Tooltip>
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {isLoggedIn &&
                                      (row?.file?.type ===
                                        'application/pdf' ||
                                        row?.file?.type ===
                                          'text/xml') && (
                                        <>
                                          <Button
                                            className={
                                              classes.tableBtn
                                            }
                                            onClick={() =>
                                              addElectricSignature(
                                                row,
                                                index
                                              )
                                            }
                                            disabled={processingQueue}
                                          >
                                            <Tooltip
                                              title={handleLabelKEY(
                                                selected_Language ===
                                                  'English'
                                                  ? adminlabelsFromReducer
                                                      ?.EN
                                                      ?.Add_Electronic_Signature
                                                  : adminlabelsFromReducer
                                                      ?.DE
                                                      ?.Add_Electronic_Signature,
                                                'Add Electronic Signature'
                                              )}
                                            >
                                              <i
                                                className={
                                                  'fas fa-file-signature'
                                                }
                                                style={{
                                                  fontSize: '15px'
                                                }}
                                              ></i>
                                            </Tooltip>
                                          </Button>

                                          <Button
                                            className={
                                              classes.tableBtn
                                            }
                                            onClick={() =>
                                              addElectricSignatureWithMetaData(
                                                [row],
                                                index
                                              )
                                            }
                                            disabled={processingQueue}
                                          >
                                            <Tooltip
                                              title={handleLabelKEY(
                                                selected_Language ===
                                                  'English'
                                                  ? adminlabelsFromReducer
                                                      ?.EN
                                                      ?.add_electronic_signature_with_metadata
                                                  : adminlabelsFromReducer
                                                      ?.DE
                                                      ?.add_electronic_signature_with_metadata,
                                                'Add Electronic Signature with Metadata'
                                              )}
                                            >
                                              <i
                                                className={
                                                  'fas fa-file-contract'
                                                }
                                                style={{
                                                  fontSize: '15px'
                                                }}
                                              ></i>
                                            </Tooltip>
                                          </Button>
                                        </>
                                      )}
                                    <Button
                                      className={classes.tableBtn}
                                      onClick={() =>
                                        addStamp(row, index)
                                      }
                                      disabled={processingQueue}
                                    >
                                      <Tooltip title="Add Stamp">
                                        <i
                                          className={'fas fa-stamp'}
                                          style={{ fontSize: '15px' }}
                                        ></i>
                                      </Tooltip>
                                    </Button>
                                    <Button
                                      className={classes.tableBtn}
                                      onClick={() =>
                                        onAddMetaData(
                                          [row],
                                          false,
                                          index
                                        )
                                      }
                                      disabled={processingQueue}
                                      style={{ maxWidth: '25px' }}
                                    >
                                      <Tooltip
                                        title={handleLabelKEY(
                                          selected_Language ===
                                            'English'
                                            ? adminlabelsFromReducer
                                                ?.EN
                                                ?.add_to_stamp_with_meta_data
                                            : adminlabelsFromReducer
                                                ?.DE
                                                ?.add_to_stamp_with_meta_data,
                                          'Add to Stamp with Meta Data'
                                        )}
                                      >
                                        <i
                                          className={'fas fa-table'}
                                          style={{ fontSize: '15px' }}
                                        ></i>
                                      </Tooltip>
                                    </Button>
                                    <StampValidationSwitch
                                      index={index}
                                      row={row}
                                      modal={false}
                                    />
                                  </>
                                )}
                                <Button
                                  className={classes.tableBtn}
                                  style={{ maxWidth: '25px' }}
                                  disabled={processingQueue}
                                  onClick={() => deleteStamp(index)}
                                >
                                  <Tooltip
                                    title={handleLabelKEY(
                                      selected_Language === 'English'
                                        ? adminlabelsFromReducer?.EN
                                            ?.remove
                                        : adminlabelsFromReducer?.DE
                                            ?.remove,
                                      'Remove'
                                    )}
                                  >
                                    <i
                                      className={'fas fa-times'}
                                      style={{ fontSize: '15px' }}
                                    ></i>
                                  </Tooltip>
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        className={classes.tableData}
                        colSpan="4"
                      >
                        {handleLabelKEY(
                          selected_Language === 'English'
                            ? adminlabelsFromReducer?.EN?.no_data
                            : adminlabelsFromReducer?.DE?.no_data,
                          'No Data'
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbars>
          </div>
          {fileHash.length > 0 && (
            <Typography
              color="secondary"
              className={classes.totalStamp}
            >
              {handleLabelKEY(
                selected_Language === 'English'
                  ? adminlabelsFromReducer?.EN?.displaying_a_total_of
                  : adminlabelsFromReducer?.DE?.displaying_a_total_of,
                'Displaying a total of'
              )}{' '}
              {fileHash.length} stamp
              {fileHash.length > 1 && 's'}
            </Typography>
          )}
        </div>
        <Dialog maxWidth="md" open={open} onClose={handleClose}>
          <DialogTitle className={classes.stampTitle}>
            {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.json_view
                : adminlabelsFromReducer?.DE?.json_view,
              'JSON View'
            )}
            <CloseIcon
              className={classes.closeicon}
              onClick={handleClose}
              color="secondary"
            />
          </DialogTitle>
          <DialogContent className={classes.boxJson}>
            <Box
              noValidate
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 'auto',
                width: 'fit-content'
              }}
            >
              <div>
                <pre>{JSON.stringify(jsonDetail, null, 2)}</pre>
              </div>
            </Box>
            <img
              src={CopyContent}
              alt="CopyContent"
              onClick={() => handlerCopy(JSON.stringify(jsonDetail))}
              className={classes.copyicon}
            />
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>

        {metaDataStateForPopup.length > 0 && (
          <Modal
            isOpen={metaDataPopupOpen.state}
            centered
            className="popupMetadata"
          >
            <ModalHeader
              className="moduleButton"
              toggle={() => closeMetaDataPopup(false)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <p
                  style={{
                    fontFamily: 'LatoBold',
                    fontSize: 22,
                    color: '#0D0F12'
                  }}
                >
                  {handleLabelKEY(
                    selected_Language === 'English'
                      ? adminlabelsFromReducer?.EN?.stamp_metadata
                      : adminlabelsFromReducer?.DE?.stamp_metadata,
                    'Stamp MetaData'
                  )}
                </p>
                {electricSignature && (
                  <div className={classes.electronicSignature}>
                    <p>
                      {handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN
                              ?.electronic_signature
                          : adminlabelsFromReducer?.DE
                              ?.electronic_signature,
                        'Electronic Signature'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </ModalHeader>
            <ModalBody>
              <MetaDataPopupComponent
                metaDataStateForPopup={metaDataStateForPopup}
                setMetaDataStateForPopup={setMetaDataStateForPopup}
                setStampButtonPopupDisabled={
                  setStampButtonPopupDisabled
                }
                electricSignature={electricSignature}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                className={classes.actionBtn}
                disabled={stampButtonPopupDisabled}
                color="secondary"
                onClick={() => closeMetaDataPopup(true)}
              >
                {`Stamp ${
                  metaDataStateForPopup?.length > 1
                    ? handleLabelKEY(
                        selected_Language === 'English'
                          ? adminlabelsFromReducer?.EN?.all
                          : adminlabelsFromReducer?.DE?.all,
                        'All'
                      )
                    : ''
                }`}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </MuiThemeProvider>
    </div>
  )
}

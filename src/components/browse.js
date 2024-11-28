import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {
  MuiThemeProvider,
  createTheme,
  makeStyles
} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import { debounce } from 'lodash'
import moment from 'moment'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { useDispatch, useSelector } from 'react-redux'
import {
  downloadFile,
  getHash,
  getStampList
} from '../actions/account'
import {
  handleLabelKEY,
  toastSuccess
} from '../common/commonFunctions'
import { debounceTimeInMilliseconds } from '../common/constants'
import { getImageUrl } from '../common/handleAmazonS3Image'
import { setLoading } from '../store/loader/action'
import { useHistory } from "react-router";

const CopyContent = getImageUrl('content_copy.svg')

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
  fileName: {
    width: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
    textAlign: 'center',
    fontSize: 11
  },
  eSignstatusLabel: {
    padding: '3px 10px',
    color: '#fff',
    background: '#048EF1',
    borderRadius: 11,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 11
  },
  tableData: {
    fontSize: 15,
    fontFamily: 'Lato',
    color: '#4C4F53'
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

const Browse = () => {
  const observer = useRef()
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

  const [searchBar, setSearchBar] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchVal, setsearchVal] = useState('')
  const [listData, SetListData] = useState([])
  const [totalListData, SettotalListData] = useState(0)
  const [open, setOpen] = useState(false)
  const [jsonDetail, setJsonDetail] = useState({})
  const [isLoadig, setIsLoading] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const getStampListing = () => {
    let params = {
      page: currentPage,
      limit: 10,
      search: searchVal
    }
    setIsLoading(true)
    dispatch(setLoading(true))
    getStampList(params)
      .then((res) => {
        if (res.data.files.length) {
          SettotalListData(res.data.count)
          SetListData([...listData, ...res.data.files])
          if (listData.length >= res.data.count) {
            setHasMore(false)
          }
        } else {
          SetListData([])
        }
        setIsLoading(false)
        dispatch(setLoading(false))
      })
      .catch(() => {
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

  const filteredSearch = (params) => {
    getStampList(params)
      .then((res) => {
        if (res.data.files.length) {
          SettotalListData(res.data.count)
          SetListData(res.data.files)
          if (listData.length >= res.data.count) {
            setHasMore(false)
          }
        } else {
          SetListData([])
        }
        dispatch(setLoading(false))
      })
      .catch(() => {
        dispatch(setLoading(false))
      })
  }

  // eslint-disable-next-line
  const delayedSearch = useCallback(
    debounce(filteredSearch, debounceTimeInMilliseconds),
    []
  )

  const jsonViewCerificate = (item) => {
    const parmasVal = {
      id: item.code
    }
    dispatch(setLoading(true))
    getHash(parmasVal)
      .then((response) => {
        const JsonView = {
          name: response.data.filename,
          txId: response.data.txid,
          hash: response.data.hash,
          code: response.data.code,
          createdAt: moment(response.data.timestamp).format('llll')
        }
        let metaData = {}
        if (response.data.metaData.length) {
          metaData = response.data.metaData[0]
        }
        const JsonViewItem = { ...JsonView, ...metaData }
        setOpen(true)
        setJsonDetail(JsonViewItem)
        dispatch(setLoading(false))
      })
      .catch((err) => {
        dispatch(setLoading(false))
      })
  }

  const downloadCerificate = (id, filename) => {
    const parmasVal = {
      id: id
    }
    let file = filename.split('.')
    dispatch(setLoading(true))
    downloadFile(parmasVal)
      .then((res) => {
        const linkSource = res.data
        const downloadLink = document.createElement('a')
        const fileName = `${file[0]}.pdf`
        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()
        dispatch(setLoading(false))
      })
      .catch(() => {
        dispatch(setLoading(false))
      })
  }
  
  const history = useHistory();

  const viewCerificate = (hash) => {
    // window.open('/' + hash, '_blank')
    history.push(`/${hash}`);
  }

  const handleClickClose = () => {
    setSearchBar(false)
    SetListData(listData)
    setsearchVal('')
  }
  const classes = useStyles()

  const typeVal = (type) => {
    let typeVal = ''
    if (type === '0') {
      typeVal = 'API'
    } else if (type === '1') {
      typeVal = 'Web'
    } else if (type === '2') {
      typeVal = 'Mobile'
    } else if (type === '3') {
      typeVal = 'Desktop'
    } else if (type === '4') {
      typeVal = 'Extension'
    } else if (type === '5') {
      typeVal = 'WP'
    }
    return typeVal
  }

  const status = (isEsign) => {
    let isESign = false

    if (isEsign) {
      isESign = true
    } else {
      isESign = false
    }

    return isESign
  }

  const handleInputEvent = (value) => {
    setsearchVal(value)
    setCurrentPage(1)
    delayedSearch({
      page: 1,
      search: value,
      limit: 10
    })
  }

  const incrementPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          totalListData > listData.length
        ) {
          incrementPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listData]
  )

  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchVal === '') {
      getStampListing()
    }
    // eslint-disable-next-line
  }, [currentPage]) // eslint-disable-next-line

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.tabContent}>
        <div className={classes.metaData}>
          <Typography className={classes.stampTitle}>
            {handleLabelKEY(
              selected_Language === 'English'
                ? adminlabelsFromReducer?.EN?.browse_stamps
                : adminlabelsFromReducer?.DE?.browse_stamps,
              'Browse stamps'
            )}
          </Typography>
        </div>
        <div className={classes.browseData}>
          <div className={classes.searchBar}>
            <TextField
              placeholder={handleLabelKEY(
                selected_Language === 'English'
                  ? adminlabelsFromReducer?.EN?.search_file
                  : adminlabelsFromReducer?.DE?.search_file,
                'Search file'
              )}
              name="search"
              id="search"
              variant="outlined"
              color="secondary"
              fullWidth
              className={classes.searchInput}
              value={searchVal}
              onChange={(e) => handleInputEvent(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {searchBar ? (
                      <Button
                        style={{ minWidth: 0, padding: 0 }}
                        onClick={handleClickClose}
                      >
                        <CloseIcon color="secondary" />
                      </Button>
                    ) : (
                      <Button style={{ minWidth: 0, padding: 0 }}>
                        <SearchIcon color="secondary" />
                      </Button>
                    )}
                  </InputAdornment>
                )
              }}
            />
          </div>
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
                        ? adminlabelsFromReducer?.EN?.filename
                        : adminlabelsFromReducer?.DE?.filename,
                      'FileName'
                    )}
                  </TableCell>
                  <TableCell className={classes.tableHeader}>
                    {handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.category
                        : adminlabelsFromReducer?.DE?.category,
                      'category'
                    )}
                  </TableCell>
                  <TableCell className={classes.tableHeader}>
                    {handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.status
                        : adminlabelsFromReducer?.DE?.status,
                      'status'
                    )}
                  </TableCell>
                  <TableCell className={classes.tableHeader}>
                    {handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.timestamp_gmt
                        : adminlabelsFromReducer?.DE?.timestamp_gmt,
                      'timestamp(gmt)'
                    )}
                  </TableCell>
                  <TableCell className={classes.tableHeader}>
                    {handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.short_code
                        : adminlabelsFromReducer?.DE?.short_code,
                      'Short Code'
                    )}
                  </TableCell>
                  <TableCell
                    className={classes.tableHeader}
                    align="center"
                  >
                    {handleLabelKEY(
                      selected_Language === 'English'
                        ? adminlabelsFromReducer?.EN?.actions
                        : adminlabelsFromReducer?.DE?.actions,
                      'actions'
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listData.length ? (
                  listData.map((row, index) => {
                    const isLastElement =
                      listData.length === index + 1
                    return isLastElement ? (
                      <TableRow key={index} ref={lastElementRef}>
                        <TableCell
                          title={row.name}
                          className={classes.tableData}
                        >
                          <p className={classes.fileName}>
                            {row?.name?.length > 50
                              ? row.name.substring(0, 50) + '...'
                              : row.name}
                          </p>
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          {typeVal(row.type)}
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          <label
                            className={
                              status(row.isEsign)
                                ? classes.eSignstatusLabel
                                : classes.statusLabel
                            }
                          >
                            {status(row.isEsign) ? (
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
                            )}
                          </label>
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          {moment(row.createdAt).format(
                            'DD/MM/YYYY hh:mm:ss A'
                          )}
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          <Button
                            style={{ textTransform: 'none' }}
                            className={`${classes.tableBtn} ${classes.sortLink}`}
                            onClick={() => viewCerificate(row.code)}
                          >
                            {' '}
                            {row.code ? row.code : '-'}{' '}
                          </Button>
                        </TableCell>
                        <TableCell
                          className={classes.tableData}
                          align="center"
                        >
                          <Button
                            className={classes.tableBtn}
                            onClick={() =>
                              viewCerificate(`hash_${row.hash}`)
                            }
                            style={{ maxWidth: '25px' }}
                          >
                            <Tooltip
                              title={handleLabelKEY(
                                selected_Language === 'English'
                                  ? adminlabelsFromReducer?.EN?.view
                                  : adminlabelsFromReducer?.DE?.view,
                                'View'
                              )}
                            >
                              <i
                                className={'fas fa-eye'}
                                style={{ fontSize: '15px' }}
                              ></i>
                            </Tooltip>
                          </Button>
                          {userData.viewType === 0 && (
                            <>
                              <Button
                                className={classes.tableBtn}
                                onClick={() =>
                                  downloadCerificate(
                                    row._id,
                                    row.name
                                  )
                                }
                                style={{ maxWidth: '25px' }}
                              >
                                {' '}
                                <Tooltip
                                  title={handleLabelKEY(
                                    selected_Language === 'English'
                                      ? adminlabelsFromReducer?.EN
                                          ?.download_certificate
                                      : adminlabelsFromReducer?.DE
                                          ?.download_certificate,
                                    'Download Certificate'
                                  )}
                                >
                                  <i
                                    className={'fas fa-file-download'}
                                    style={{ fontSize: '15px' }}
                                  ></i>
                                </Tooltip>
                              </Button>
                            </>
                          )}
                          {userData.viewType === 1 && (
                            <>
                              <Button
                                className={classes.tableBtn}
                                onClick={() =>
                                  jsonViewCerificate(row)
                                }
                              >
                                {' '}
                                <Tooltip
                                  title={handleLabelKEY(
                                    selected_Language === 'English'
                                      ? adminlabelsFromReducer?.EN
                                          ?.json_view
                                      : adminlabelsFromReducer?.DE
                                          ?.json_view,
                                    'JSON View'
                                  )}
                                >
                                  <i
                                    className={'fa fa-code'}
                                    style={{ fontSize: '15px' }}
                                  ></i>
                                </Tooltip>
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={index}>
                        <TableCell
                          title={row.name}
                          className={classes.tableData}
                        >
                          <p className={classes.fileName}>
                            {row.name}
                          </p>
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          {typeVal(row.type)}
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          <label
                            className={
                              status(row.isEsign)
                                ? classes.eSignstatusLabel
                                : classes.statusLabel
                            }
                          >
                            {status(row.isEsign) ? (
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
                            )}
                          </label>
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          {moment(row.createdAt).format(
                            'DD/MM/YYYY hh:mm:ss A'
                          )}
                        </TableCell>
                        <TableCell className={classes.tableData}>
                          <Button
                            style={{ textTransform: 'none' }}
                            className={`${classes.tableBtn} ${classes.sortLink}`}
                            onClick={() => viewCerificate(row.code)}
                          >
                            {' '}
                            {row.code ? row.code : '-'}{' '}
                          </Button>
                        </TableCell>
                        <TableCell
                          className={classes.tableData}
                          align="center"
                        >
                          <Button
                            style={{ maxWidth: '25px' }}
                            className={classes.tableBtn}
                            onClick={() =>
                              viewCerificate(`hash_${row.hash}`)
                            }
                          >
                            <Tooltip
                              title={handleLabelKEY(
                                selected_Language === 'English'
                                  ? adminlabelsFromReducer?.EN?.view
                                  : adminlabelsFromReducer?.DE?.view,
                                'View'
                              )}
                            >
                              <i
                                className={'fas fa-eye'}
                                style={{ fontSize: '15px' }}
                              ></i>
                            </Tooltip>
                          </Button>
                          {userData.viewType === 0 && (
                            <>
                              <Button
                                style={{ maxWidth: '25px' }}
                                className={classes.tableBtn}
                                onClick={() =>
                                  downloadCerificate(
                                    row._id,
                                    row.name
                                  )
                                }
                              >
                                {' '}
                                <Tooltip
                                  title={handleLabelKEY(
                                    selected_Language === 'English'
                                      ? adminlabelsFromReducer?.EN
                                          ?.download_certificate
                                      : adminlabelsFromReducer?.DE
                                          ?.download_certificate,
                                    'Download Certificate'
                                  )}
                                >
                                  <i
                                    className={'fas fa-file-download'}
                                    style={{ fontSize: '15px' }}
                                  ></i>
                                </Tooltip>
                              </Button>
                            </>
                          )}
                          {userData.viewType === 1 && (
                            <>
                              <Button
                                style={{ maxWidth: '25px' }}
                                className={classes.tableBtn}
                                onClick={() =>
                                  jsonViewCerificate(row)
                                }
                              >
                                {' '}
                                <Tooltip
                                  title={handleLabelKEY(
                                    selected_Language === 'English'
                                      ? adminlabelsFromReducer?.EN
                                          ?.json_view
                                      : adminlabelsFromReducer?.DE
                                          ?.json_view,
                                    'JSON View'
                                  )}
                                >
                                  <i
                                    className={'fa fa-code'}
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
                ) : !isLoadig ? (
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
                ) : (
                  <TableRow>
                    <TableCell
                      className={classes.tableData}
                      colSpan="4"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbars>
        </div>
        {listData.length > 0 && (
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
            {totalListData} stamp
            {listData.length > 1 && 's'}
          </Typography>
        )}
      </div>
      <Dialog
        maxWidth="md"
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle className={classes.stampTitle}>
          title=
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
    </MuiThemeProvider>
  )
}

export default Browse

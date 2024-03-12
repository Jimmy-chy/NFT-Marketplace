import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Web3 from "web3";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { selectedNft, removeSelectedNft } from "../../redux/actions/nftActions";

import { useStyles } from "./styles.js";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {Paper} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LockIcon from '@material-ui/icons/Lock';

const useStylesDetails = makeStyles((theme) => ({
  root: {
    marginLeft: "3em",
    marginRight: "3em",
    marginTop: "1em",
    marginBottom: "1em"
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
  },
}));
const Item = () => {
  const classes = useStyles();
  const classesDetails = useStylesDetails();
  const { nftId } = useParams();
  const marketplaceContract = useSelector(
      (state) => state.allNft.marketplaceContract
  );
  const artTokenContract = useSelector(
      (state) => state.allNft.artTokenContract
  );
  const account = useSelector((state) => state.allNft.account);
  let nft = useSelector((state) => state.nft);
  let nftItem = useSelector((state) =>
      state.allNft.nft.filter((nft) => nft.tokenId === nftId)
  );
  const {
    image,
    name,
    type,
    price,
    owner,
    creator,
    description,
    tokenId,
    saleId,
    isForSale,
    isSold,
    isTransfer,
    author,
    college,
  } = nft;

  const dispatch = useDispatch();

  useEffect(() => {

    if (nftId && nftId !== "" && nftItem) dispatch(selectedNft(nftItem[0]));
    return () => {
      dispatch(removeSelectedNft());
    };
  }, [nftId]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function putForSale(id, price) {
    try {
      if(isSold||!isTransfer){
        try {
          const receipt2 = await artTokenContract.methods
              .approve(marketplaceContract._address,id)
              .send({gas:210000,from: account });
        }catch (error) {
          console.error("Error while giveResaleApproval",error);
        }
      }
      const receipt = await marketplaceContract.methods
          .putItemForSale(id, price)
          .send({ gas: 210000, from: account });
    } catch (error) {
      console.error("Error, puting for sale: ", error);
      alert("Error while puting for sale!");
    }
  }

  async function buy(saleId, price) {
    try {
      const receipt = await marketplaceContract.methods
          .buyItem(saleId)
          .send({ gas: 210000, value: price, from: account });
      const id = receipt.events.itemSold.id; ///saleId
    } catch (error) {
      console.error("Error, buying: ", error);
      alert("Error while buying!");
    }
  };
  const [selectedFile, setSelectedFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = () => {
    if (!selectedFile) {
      alert('请选择一个文件');
      return;
    }

    // 模拟上传过程，实际项目中需要替换成你的上传逻辑
    const totalSize = selectedFile.size;
    const chunkSize = 1024 * 1024; // 每次上传1MB
    let uploaded = 0;

    const uploadInterval = setInterval(() => {
      uploaded += chunkSize;
      const progress = Math.min((uploaded / totalSize) * 100, 100);
      setUploadProgress(progress);

      if (progress === 100) {
        clearInterval(uploadInterval);
        // 在这里可以触发上传成功的回调或者其他操作
      }
    }, 1000);
  };
  return (
      <div className={classes.pageItem}>
        {Object.keys(nft).length === 0 ? (
            <div>...CARREGANDO</div>
        ) : (
            <main>
              <header className={classes.pageHeader}>
                <Link to="/">
                  <KeyboardBackspaceIcon fontSize="large" />
                </Link>
              </header>
              <section>
                <Grid container
                      spacing={0}
                      alignItems="center"
                      justify="center"
                >
                  <Grid item md={7} sm={7} xs={12}>
                    <figure>
                      <img className="ui fluid image" src={image} />
                    </figure>

                    <div className={classesDetails.root}>
                      <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                          <Typography className={classesDetails.heading}>Token Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div>
                              <span style={{fontSize: '14px'}}>
                                Contract Address
                              </span>
                              <a href="https://goerli.etherscan.io/address/0xd1DD75Fab6C853649eB8B6e9a8890C75817f7641" target="_blank" style={{marginLeft:'9em',fontSize: '12px'}}>0xd1DD7...7641</a>
                              <br/>
                              <div style={{marginTop: '6px',marginBottom: '6px'}}>
                                <span style={{fontSize: '14px'}}>
                                Token ID
                                </span>
                                <span style={{marginLeft:'17em',fontSize: '12px'}}>
                                  {tokenId}
                                </span>
                              </div>
                              <span style={{fontSize: '14px'}}>
                                Token Standard
                              </span>
                              <span style={{marginLeft:'11em',fontSize: '12px',marginBottom: '8px'}}>
                                ERC-721
                              </span>
                              <br/>
                              <span style={{marginTop: '6px',fontSize: '14px'}}>
                                交易记录
                              </span>
                              <a href="https://goerli.etherscan.io/nft/0xd1dd75fab6c853649eb8b6e9a8890c75817f7641/1" target="_blank" style={{marginLeft:'15em',fontSize: '12px'}}>点击查看</a>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>

                  </Grid>
                  <Grid item md={5} sm={5} xs={12}>
                    <fieldset>
                      <h1>{name}</h1>
                      <TextField
                          label="创建者"
                          name="creator"
                          variant="filled"
                          margin="dense"
                          fullWidth
                          disabled
                          defaultValue={
                              creator.slice(0, 7) + "..." + creator.slice(-4)
                          }
                      />
                      <TextField
                          label="所有者"
                          name="owner"
                          variant="filled"
                          disabled
                          fullWidth
                          margin="dense"
                          defaultValue={owner.slice(0, 7) + "..." + owner.slice(-4)}
                      />
                      <TextField
                          label="类型"
                          name="type"
                          variant="filled"
                          margin="dense"
                          disabled
                          fullWidth
                          defaultValue={"数字文创"}
                      />
                      <TextField
                          id="outlined-multiline-static"
                          multiline
                          rows={4}
                          label="描述"
                          name="description"
                          variant="filled"
                          margin="dense"
                          disabled
                          fullWidth
                          defaultValue={description}
                      />


                      <TextField
                          label="价格"
                          name="price"
                          variant="filled"
                          margin="dense"
                          defaultValue={Web3.utils.fromWei(String(price), "ether")}
                          InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">ETH</InputAdornment>
                            ),
                          }}
                          // defaultValue={String(price)}
                          // InputProps={{
                          //   startAdornment: (
                          //       <InputAdornment position="start">￥</InputAdornment>
                          //   ),
                          // }}
                          fullWidth
                          disabled
                      />
                      {/*{selectedFile && (*/}
                      {/*    // <Typography variant="body1" style={{ marginTop: 10 }}>*/}
                      {/*    //   已选择文件: {selectedFile.name}*/}
                      {/*    // </Typography>*/}
                      {/*    <TextField*/}
                      {/*        label="数据资产文件"*/}
                      {/*        name="price"*/}
                      {/*        variant="filled"*/}
                      {/*        value={selectedFile.name}*/}
                      {/*        style={{ marginTop: 10 }}*/}
                      {/*        fullWidth*/}
                      {/*    />*/}
                      {/*)}*/}
                      <Paper  style={{ padding: 10, width: '100%',  marginTop: '1em'  }}>
                        {/*<input*/}
                        {/*    // accept="image/*"*/}
                        {/*    style={{ display: 'none' }}*/}
                        {/*    id="file-upload-input"*/}
                        {/*    type="file"*/}
                        {/*    onChange={handleFileChange}*/}
                        {/*/>*/}
                        {/*<label htmlFor="file-upload-input">*/}
                        {/*{!selectedFile && (*/}
                        {/*    <Button*/}
                        {/*        variant="outlined"*/}
                        {/*        color="primary"*/}
                        {/*        component="span"*/}
                        {/*        startIcon={<CloudUploadIcon />}*/}
                        {/*        fullWidth*/}
                        {/*    >*/}
                        {/*      上传原始资产数据*/}
                        {/*    </Button>*/}
                        {/*)}*/}
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleClickOpen}
                            startIcon={<LockIcon/>}
                            style={{marginLeft: "2em",marginRight: "2em"}}
                        >
                          解密数据
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<CloudDownloadIcon />}
                        >
                          下载数据
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">{"请输入私钥解密数据"}</DialogTitle>
                          <DialogContent>
                            <TextField id='pwd' label='私钥' placeholder='请输入私钥' name="pwd" type='password' style={{width: "500px"}} required/>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} color="primary">
                              取消
                            </Button>
                            <Button onClick={handleClose} color="primary" autoFocus>
                              确认
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {/*</label>*/}
                      </Paper>

                      <Grid item xs={12} direction="row">
                        {owner === account && !isForSale && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => putForSale(tokenId, price)}
                                style={{marginTop: "2em",marginBottom: "1em",marginRight: "1em"}}
                            >
                              售卖
                            </Button>
                        )}

                        {owner !== account && isForSale && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => buy(saleId, price)}
                                style={{marginTop: "2em",marginBottom: "1em",marginRight: "1em"}}
                            >
                              购买
                            </Button>
                        )}
                        {owner == account && !isForSale &&(
                            <Link to={`/transfer/${tokenId}`}>
                              <Button
                                  variant="contained"
                                  color="primary"
                                  style={{marginTop: "2em",marginBottom: "1em",marginLeft: "1em"}}
                              >
                                转让
                              </Button>
                            </Link>
                        )}
                      </Grid>

                    </fieldset>

                  </Grid>
                </Grid>
              </section>
            </main>
        )}
      </div>
  );
};

export default Item;
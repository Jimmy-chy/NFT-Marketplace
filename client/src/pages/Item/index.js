import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Web3 from "web3";


import { selectedNft, removeSelectedNft } from "../../redux/actions/nftActions";

import { useStyles } from "./styles.js";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {Paper} from "@material-ui/core";


const Item = () => {
  const classes = useStyles();

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

  async function putForSale(id, price) {
    try {

      if(isSold||!isTransfer){
        try {

          const receipt2 = await artTokenContract.methods
              .approve(marketplaceContract._address,id)
              .send({gas:210000,from: account });
          // console.log(receipt2);
        }catch (error) {
          console.error("Error while giveResaleApproval",error);
        }

      }

      const receipt = await marketplaceContract.methods
          .putItemForSale(id, price)
          .send({ gas: 210000, from: account });

      // console.log(receipt);

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
      // console.log(receipt);
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
                          // defaultValue={Web3.utils.fromWei(String(price), "ether")}
                          defaultValue={String(price)}
                          InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">￥</InputAdornment>
                            ),
                          }}
                          fullWidth
                          disabled
                      />
                      {selectedFile && (
                          // <Typography variant="body1" style={{ marginTop: 10 }}>
                          //   已选择文件: {selectedFile.name}
                          // </Typography>
                          <TextField
                              label="数据资产文件"
                              name="price"
                              variant="filled"
                              value={selectedFile.name}
                              style={{ marginTop: 10 }}
                              fullWidth
                          />
                      )}
                      <Paper  style={{ padding: 10, width: '100%',  margin: 'auto'  }}>
                        <input
                            // accept="image/*"
                            style={{ display: 'none' }}
                            id="file-upload-input"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload-input">
                          {!selectedFile && (
                              <Button
                                  variant="outlined"
                                  color="primary"
                                  component="span"
                                  startIcon={<CloudUploadIcon />}
                                  fullWidth
                              >
                                上传原始资产数据
                              </Button>
                          )}
                          <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<CloudDownloadIcon />}
                              fullWidth
                          >
                            下载原始资产数据
                          </Button>
                        </label>


                      </Paper>

                      <Grid item xs={12} direction="row">
                        {owner === account && !isForSale && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => putForSale(tokenId, price)}
                            >
                              售卖
                            </Button>
                        )}

                        {owner !== account && isForSale && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => buy(saleId, price)}
                            >
                              购买
                            </Button>
                        )}
                        {owner == account && !isForSale &&(
                            <Link to={`/transfer/${tokenId}`}>
                              <Button
                                  variant="outlined"
                                  color="primary"
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
import React, { useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import CancelOutlinedIcon  from "@material-ui/icons/CancelOutlined";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Web3 from "web3";

import { useStyles } from "./styles.js";

import DropZone from "../../components/DropZone";

import { api } from "../../services/api";

import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

const useStylesStepper = makeStyles((theme) => ({
  root: {
    background: "#FFF",
    padding: '5px',
    width: '100%',
    margin: 'auto'
  },
  backButton: {
    marginLeft: theme.spacing(14),
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(15),
    marginBottom: theme.spacing(2),
    fontSize: '10px'
  },
}));

function getSteps() {
  return ['选择数据','数据加密','关键信息上链','完成'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return '选择数据...';
    case 1:
      return '数据加密中...';
    case 2:
      return '数据关键信息上链中...';
    case 3:
      return '完成！';
    default:
      return 'Unknown stepIndex';
  }
}

const CreateNFT = () => {
  const classes = useStyles();
  const history = useHistory();
  //进度条
  const classesStepper = useStylesStepper();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const account = useSelector((state) => state.allNft.account);
  const artTokenContract = useSelector(
      (state) => state.allNft.artTokenContract
  );

  const [selectedFile, setSelectedFile] = useState();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    price: "",
  });

  const [college,setcollege] = useState("");
  const handleChange = (event) => {
    setcollege(event.target.value);
  };

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [flag, setflag] = React.useState(true);
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setflag(true);
    setOpen(false);
  };

  const agree_handleClose = () => {
    setflag(false);
    setOpen(false);
  };
  useEffect(() => {

  }, [setflag]);

  useEffect(() => {

  }, [setcollege]);

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {

    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  function handleInputChange(event) {
    let { name, value } = event.target;
    // if(name === 'image'){
    //   value = event.target.files[0];
    // }
    setFormData({ ...formData, [name]: value });
  }

  async function createNFT(event) {
    console.log(formData)
    event.preventDefault();
    const { title,type, description,price} = formData;

    // console.log("title: " + title);
    const data = new FormData();

    data.append("name", title);
    data.append("type", type);
    data.append("description", description);
    data.append("price", price);
    // data.append("author", author);
    // data.append("college", college);

    if(selectedFile){
      data.append('img', selectedFile);
      // console.log("slectedFile: ", selectedFile);
    }

    try {
      const totalSupply = await artTokenContract.methods.totalSupply().call();
      data.append("tokenId", Number(totalSupply) + 1);

      const response = await api.post("/tokens", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      });
      // console.log("CreateNFT------------response",response);


      await mint(response.data.message);
    } catch (error) {
      console.log(error);
      // error.response.data
    }
  }

  async function mint(tokenMetadataURL) {
    try {
      const receipt = await artTokenContract.methods
          .mint(tokenMetadataURL)
          .send({ from: account });
      // console.log(receipt);
      // console.log(receipt.events.Transfer.returnValues.tokenId);
      history.push('/');
    } catch (error) {
      console.error("Error, minting: ", error);
      alert("Error while minting!");
    }
  }
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
      <div className={classes.pageCreateNft}>
        <form onSubmit={createNFT}>
          <div className={classes.formHeader}>
            <h1>创作数据资产NFT</h1>
            <Link to="/">
              <CancelOutlinedIcon fontSize="large" />
            </Link>
          </div>
          <div className={classes.content}>
            <div className={classes.dropzone}>
              <DropZone onFileUploaded={setSelectedFile} />
            </div>

            <fieldset>
              <TextField
                  label="标题"
                  name="title"
                  variant="filled"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
              />
              <TextField
                  label="类型"
                  name="type"
                  variant="filled"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  fullWidth
              />
              <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={4}
                  label="描述"
                  name="description"
                  variant="filled"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
              />

              <TextField
                  label="价格"
                  name="price"
                  variant="filled"
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                  }}
                  fullWidth
              />

              <Paper  style={{ padding: 5, width: '100%',  marginTop: '1em'  }}>
                <div className={classesStepper.root}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                  </Stepper>
                  <div>
                    {activeStep === steps.length ? (
                        <div>
                          <Typography className={classesStepper.instructions}>
                            已完成！<br/>
                            <span>
                          From：0x7471...9aa3<br/>
                        </span>
                            To：0xF716...D45F
                          </Typography>
                          <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                        <div>
                          <Typography className={classesStepper.instructions}>当前状态：{getStepContent(activeStep)}</Typography>
                          <div>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={activeStep != 0}
                                onClick={handleBack}
                                className={classesStepper.backButton}
                            >
                              选择数据
                            </Button>
                            {/*<Button variant="outlined" color="secondary" onClick={handleNext} disabled='true'>*/}
                            <Button variant="outlined" color="secondary" onClick={handleNext}>
                              {activeStep === steps.length - 1 ? 'Finish' : '加密'}
                            </Button>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </Paper>

              <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    scroll={scroll}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title">平台使用规则</DialogTitle>
                  <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                      {[...new Array(1)]
                          .map(
                              () => `
                              请您仔细阅读以下条款，如果您对本协议的任何条款表示异议，您可以选择不创建NFT。
                              我们深知个人信息对您的重要性，您的信任对我们非常重要，我们将根据法律法规要求并参照行业最佳实践为您的个人信息安全提供充分保障。
                              您使用或继续使用我们的服务，即意味着同意我们按照本《NFT平台服务协议》（以下简称“本协议”）收集、使用、储存和分享您的相关信息。
                              您确认，在您开始注册或使用NFT服务前，您应当具备中华人民共和国法律规定的与您行为相适应的民事行为能力，
                              如您是自然人，您应当是具备相应民事行为能力的自然人（十六周岁以上的未成年人，以自己的劳动收入为主要生活来源的，
                              视为完全民事行为能力人）、法人或其他组织。若您不具有完全民事行为能力，例如您未满18周岁，
                              则请您在法定监护⼈（以下统称"监护人"）的陪同下阅读和判断是否同意本协议。
                              您点击确认或继续使⽤我们的服务即视为您已经取得监护⼈的必要同意。若您不具备前述主体资格或未取得监护⼈同意，
                              请勿使用我们的服务。
                              用户不得利用NFT平台服务制作、上载、复制、发布、传播或者转载如下内容：
                                  （1） 煽动民族仇恨、民族歧视，破坏民族团结的；
                                  （2） 破坏国家宗教政策，宣扬邪教和封建迷信的；
                                  （3） 散布谣言，扰乱社会秩序，破坏社会稳定的；
                                  （4） 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
                                  （5） 侮辱或者诽谤他人，侵害他人合法权益的；
                                  （6） 含有法律、行政法规禁止的其他内容的信息。`,
                          )
                          .join('\n')}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      不同意
                    </Button>
                    <Button onClick={agree_handleClose} color="primary">
                      同意
                    </Button>
                  </DialogActions>
                </Dialog>
                <div style={{ marginTop: 10 }}>
                  <Button variant="contained" color="primary" onClick={handleClickOpen('paper')} style={{marginRight: '1em'}}>版权协议</Button>
                  <Button variant="contained" color="primary" type="submit" disabled={flag}>
                    提交
                  </Button>
                </div>

              </div>
            </fieldset>
          </div>
        </form>
      </div>
  );
};

export default CreateNFT;

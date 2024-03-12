import React, { useState, useEffect } from 'react';
import {useSelector} from "react-redux";
import {Grid, Paper, Avatar, TextField, Button, Typography, Link, Icon} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import SignUp from "./signup";
import Web3 from 'web3';

import ParticlesBg from "particles-bg";
import {api} from "../../services/api";
import { useHistory } from 'react-router-dom';
import {ex} from '../../common/global.js'
import { setCookie, getCookie, removeCookie } from '../../common/rememberPwd';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../../assets/MetaMask.png';
const MetaMaskIcon = () => {
    const classes = useStyles();

    return (
        <Icon className={classes.icon}>
            <img src={logo} alt="MetaMask" width="24" height="24" />
        </Icon>
    );
};
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: '100vh',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    heading: {
        fontSize: theme.typography.pxToRem(18),
        fontWeight: theme.typography.fontWeightBold,
        marginTop: '1em',
        marginBottom: '1em',
        textAlign: 'center'
    },
}));
const Login = () => {
    /*
        MetaMask钱包地址
        当用户登录时，用于判断当前钱包地址是否和用户注册时所填写的钱包地址一致
     */
    const [metaMaskAddress, setMetaMaskAddress] = useState('');
    const accountAddress = useSelector((state) => state.allNft.account);
    // console.log(accountAddress);
    const classes = useStyles();
    const [formData, setFormData] = useState({
        uname: "",
        pwd: "",
        isRem: false,
        isFirst: true,
    });
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        // 检测 MetaMask 是否已连接，并获取用户地址
        async function getMetaMaskAddress() {
            if (window.ethereum) {
                try {
                    await window.ethereum.enable();
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setMetaMaskAddress(accounts[0]);
                    const web3 = new Web3(window.ethereum);
                    setWeb3(web3);
                } catch (error) {
                    console.error('MetaMask connection error:', error);
                }
            }
        }

        getMetaMaskAddress();
    }, []);

    const handleLogin = async () => {
        try {
            // 使用 MetaMask 进行签名
            const signature = await web3.eth.personal.sign('登录数字资产交易管理平台', metaMaskAddress, '');
            console.log('Signature:', signature);
            alert('登录成功！');
        } catch (error) {
            console.error('Login error:', error);
            alert('登录失败，请检查 MetaMask 是否已连接');
        }
    };



    const history = useHistory()
    useEffect(()=>{
        if (getCookie('uname') !== '' && getCookie('pwd') !== '') {
            var username = getCookie('uname')
            var password = getCookie('pwd')
            document.getElementById('uname').value=username
            document.getElementById('pwd').value=password
            setFormData({...formData, ["isRem"]:true, ["uname"]:username, ["pwd"]:password})
        }
    },[])
    const paperStyle = {padding: 20, height: '60vh', width: 500, margin: "2em auto"}
    const avatarStyle = {backgroundColor: '#1b5cbd',marginTop: '3em'}
    const btnstyle = {margin: '8px 0'}
    let config = {
        num: [4, 7],
        rps: 0.1,
        radius: [5, 40],
        life: [1.5, 3],
        v: [2, 3],
        tha: [-40, 40],
        alpha: [0.6, 0],
        scale: [.1, 0.4],
        position: "all",
        color: ["random", "#ff0000"],
        cross: "dead",
        // emitter: "follow",
        random: 15
    };

    if (Math.random() > 0.85) {
        config = Object.assign(config, {
            onParticleUpdate: (ctx, particle) => {
                ctx.beginPath();
                ctx.rect(
                    particle.p.x,
                    particle.p.y,
                    particle.radius * 2,
                    particle.radius * 2
                );
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.closePath();
            }
        });
    }

    // console.log("111",document.getElementsByName('uname').value)
    function rmbpsw(e){
        setFormData({ ...formData, ["isRem"]: e.target.checked });
        console.log(formData)
    }

    function handleInputChange(event) {
        let { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        console.log("哈哈哈",name, value,formData)
    }
    //接受用户输入参数

    function logOut(){
        ex.clear()
        history.push('/')
        console.log("三影片",ex)
    }
    async function login(event){
        console.log("登陆")
        console.log(formData)
        event.preventDefault();
        var Tname = document.getElementById("uname").value
        var Tpwd = document.getElementById("pwd").value
        setFormData({...formData, ["uname"]:Tname, ["pwd"]:Tpwd})
        if(formData["isRem"]){
            setCookie('uname',Tname,1)
            setCookie('pwd',Tpwd,1)
        }else{
            removeCookie('uname')
            removeCookie('pwd')
        }
        console.log("???",Tname)
        console.log(formData)
        const {uname,pwd} = formData;
        if(uname===""){
            alert("请输入用户名")
            return
        }
        if(pwd===""){
            alert("请输入密码")
            return
        }
        var Fdata = {}
        Fdata["uname"] = uname
        Fdata["pwd"] = pwd
        //发送请求
        try {
            console.log(Fdata)
            const response = await api.post("/login", Fdata, {
                headers: {
                    // "Content-Type": `multipart/form-data; boundary=${Fdata._boundary}`,
                },
            });
            console.log("response:", response.data)
            if(response.data === 'OK'){
                ex.setData(uname)
                try {
                    console.log(Fdata)
                    const response = await api.post("/find", Fdata, {
                        headers: {
                            // "Content-Type": `multipart/form-data; boundary=${Fdata._boundary}`,
                        },
                    });
                    console.log("response:", response)
                    var userData = response.data[0];
                    ex.setfullData(userData)
                    console.log("三影片", ex)
                } catch (error) {
                    console.log(error);
                }
                console.log("存储的用户名", ex.uname)
                alert("登陆成功")
                history.push('/')
            }else{
                alert("用户名不存在或密码错误")
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Grid>
            <ParticlesBg type="custom" config={config} bg={true}/>

            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <h2>数字资产交易管理平台</h2>
                </Grid>
                <Paper  style={{ padding: 10, width: '100%',  marginTop: '2em',marginBottom:'2em'  }}>


                    <Typography className={classes.heading}>已连接的 MetaMask 钱包</Typography>
                    <Typography  gutterBottom align="center" style={{ padding: 10  }}>
                        <MetaMaskIcon />
                    </Typography>
                    <Paper  style={{ padding: 10, width: '100%',  marginBottom:'1em'  }}>
                        <Typography  gutterBottom align="center">
                            {metaMaskAddress.slice(0, 7)}...{metaMaskAddress.slice(-4)}
                        </Typography>
                    </Paper>
                </Paper>

                <div style={{display:ex.isLogin?'none':'block'}}>
                    {/*<TextField id='uname' onChange={handleInputChange} label='用户名' placeholder='输入用户名' name="uname" fullWidth required/>*/}
                    {/*<TextField id='pwd' onChange={handleInputChange} label='密码' placeholder='输入密码' name="pwd" type='password' fullWidth required/>*/}
                    {/*<FormControlLabel id='rmb' onChange={rmbpsw} checked={formData["isRem"]}*/}
                    {/*                  control={*/}
                    {/*                      <Checkbox*/}
                    {/*                          name="checkedB"*/}
                    {/*                          color="primary"*/}
                    {/*                      />*/}
                    {/*                  }*/}
                    {/*                  label="记住密码"*/}
                    {/*/>*/}
                    {/*<Link href="/">*/}
                    <Button onClick={handleLogin} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>使用MetaMask钱包登录</Button>
                    {/*</Link>*/}
                    {/*<Typography>*/}
                    {/*    <Link href="#">*/}
                    {/*        忘记密码 ?*/}
                    {/*    </Link>*/}
                    {/*</Typography>*/}
                    {/*<Typography>*/}
                    {/*    <Link href="SignUp">*/}
                    {/*        注册*/}
                    {/*    </Link>*/}
                    {/*</Typography>*/}
                </div>
                <div style={{display:ex.isLogin?'block':'none'}}>
                    <h1>已登陆用户:{ex.uname}</h1>
                    <button onClick={logOut}>退出登陆</button>
                </div>

            </Paper>
        </Grid>
    )
}

export default Login;
import React, {useState} from 'react'
import {Grid, Paper, Avatar, Typography, TextField, Button} from '@material-ui/core'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Link} from "react-router-dom";
import ParticlesBg from "particles-bg";
import {api} from "../../services/api";
import { useHistory } from 'react-router-dom';

const Signup = () => {
    const history = useHistory()
    const paperStyle = {padding: '30px 20px', width: 500, margin: "20px auto"}
    const headerStyle = {margin: 0}
    const avatarStyle = {backgroundColor: '#073cad'}
    const marginTop = {marginTop: 5}
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
    function handleInputChange(event) {
        let { name, value } = event.target;
        // if(name === 'image'){
        //   value = event.target.files[0];
        // }
        setFormData({ ...formData, [name]: value });
    }
    const [formData, setFormData] = useState({
        uname: "",
        address: "",
        email: "",
        gender: "",
        phone: "",
        pwd: "",
        cPwd:"",
    });

    //key与名称转换
    const transferTable ={
        uname: "用户名",
        pwd: "密码",
        cPwd:"确认密码",
        address: "账户地址",
        email: "邮箱",
        gender: "性别",
        phone: "电话号码",
    }
    let isAgreeable = false;

    function agree(){
        isAgreeable = !isAgreeable;
        console.log(isAgreeable);
    }

    async function Signup(event) {
        console.log(formData)
        //检查有无未输入项
        for(let key in formData){
            console.log(key)
            if(formData[key]===""){
                alert("请输入"+transferTable[key])
                event.preventDefault()
                return
            }
        }
        //检查是否勾选协议
        if(!isAgreeable){
            alert("请勾选协议")
            event.preventDefault()
            return
        }
        //检查两次密码是否一致
        if(formData.pwd !== formData.cPwd){
            event.preventDefault()
            alert("两次输入的密码不一致")
            return
        }
        event.preventDefault();

        const {uname,pwd, address, email, gender, phone} = formData;
        var Fdata = {}
        Fdata["uname"] = uname
        Fdata["pwd"] = pwd
        Fdata["address"] = address
        Fdata["email"] = email
        Fdata["gender"] = gender
        Fdata["phone"] = phone

        //发送请求
        try {
            console.log(Fdata)
            const response = await api.post("/signup", Fdata, {
                headers: {
                    // "Content-Type": `multipart/form-data; boundary=${Fdata._boundary}`,
                },
            });
            console.log("response:", response)
            //请求成功，跳转到登陆页面
            if(response.data === 'OK'){
                console.log("注册成功")
                alert("注册成功")
                history.push('/login')
            }
            //请求失败，提示失败原因
            else{
                if(response.data.endsWith("'user.uname'"))
                    alert("用户名已存在")
                else if(response.data.endsWith("'user.address'"))
                    alert("此地址已被注册过")
                else
                    alert("其他")
            }
        } catch (error) {
            console.log(error);
            alert("注册失败")
        }
    }

    return (
        <Grid>
            <ParticlesBg type="custom" config={config} bg={true}/>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon/>
                    </Avatar>
                    <h2 style={headerStyle}>注册</h2>
                </Grid>
                <form onSubmit={Signup}>
                    <TextField fullWidth label='用户名' name="uname" value={formData.uname} onChange={handleInputChange} placeholder="请输入用户名"/>
                    <TextField fullWidth label='账户地址' name="address"value={formData.address} onChange={handleInputChange} placeholder="请输入账户地址"/>
                    <TextField fullWidth label='邮箱' name="email" value={formData.email} onChange={handleInputChange} placeholder="请输入邮箱"/>
                    <FormControl component="fieldset" style={marginTop}>
                        <FormLabel component="legend">性别</FormLabel>
                        <RadioGroup aria-label="Gender" onChange={handleInputChange} name="gender" style={{display: 'initial'}}>
                            <FormControlLabel value="0" control={<Radio/>} label="女"/>
                            <FormControlLabel value="1" control={<Radio/>} label="男"/>
                        </RadioGroup>
                    </FormControl>
                    <TextField fullWidth label='电话号码' name="phone" value={formData.phone} onChange={handleInputChange} placeholder="请输入电话号码"/>
                    <TextField fullWidth label='密码' name="pwd" type='password' value={formData.pwd} onChange={handleInputChange} placeholder="请输入密码"/>
                    <TextField fullWidth label='确认密码' name='cPwd' type='password' value={formData.cPwd} onChange={handleInputChange} placeholder="确认密码"/>
                    <FormControlLabel
                        control={<Checkbox
                            onClick={agree}
                            name="checkedA"/>}
                        label="同意所有条件"
                    />
                    {/*<Link to="/Login">*/}
                    <Button type='submit' variant='contained' color='primary' fullWidth>注册</Button>
                    {/*</Link>*/}
                </form>
            </Paper>
        </Grid>
    )
}

export default Signup;
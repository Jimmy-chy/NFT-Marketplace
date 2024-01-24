import React, {useState, useEffect} from "react";
import {useStyles} from './styles.js'
import avatar from '../../assets/user.jpg';
import {ex} from '../../common/global.js';
import {api} from "../../services/api";

const UserInfo = () => {

    // Signup()
    const classes = useStyles();
    var uname = ex.uname;
    var gender = ex.gender;
    var email = ex.email;
    var address =ex.address;
    var phone = ex.phone;
    return (
        <section className={classes.content}>
            <div className={classes.title}>
                <h1 >基本信息</h1>
            </div>
            <div className={classes.row}>
                <div>
                    <img src={avatar} alt="user" className={classes.images}/>
                </div>
                <div className={classes.Info}>
                    <span><h1>姓名：Jimmy</h1></span>
                    <span><h1>性别：男</h1></span>
                    <span><h1>MetaMask地址：0x747113Ee64EFb27EE8CA10DA16D9Be0F451c9aa3</h1></span>
                    <span><h1>邮箱：464321656@qq.com</h1></span>
                    <span><h1>联系电话：13162832609</h1></span>
                </div>

            </div>
        </section>
    )
};

export default UserInfo;
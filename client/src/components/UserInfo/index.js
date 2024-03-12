import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Avatar, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2),
    },
    avatar: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        marginBottom: theme.spacing(2),
    },
    textField: {
        marginBottom: theme.spacing(3),
    },
    fileInput: {
        display: 'none',
    },
}));

const ProfilePage = () => {
    const classes = useStyles();
    const [name, setName] = useState('Jimmy');
    const [email, setEmail] = useState('123456789@qq.com');
    const [address, setAddress] = useState('0x747113Ee64EFb27EE8CA10DA16D9Be0F451c9aa3');
    const [phone, setPhone] = useState('17812345678');
    const [bio, setBio] = useState('0x747113Ee64EFb27EE8CA10DA16D9Be0F451c9aa3');
    const [avatar, setAvatar] = useState(null);
    const [gender, setGender] = useState('male');

    const handleSave = () => {
        // 这里可以将更新后的个人信息提交到后端保存
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Bio:', bio);
        console.log('Avatar:', avatar);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={classes.root}>
            <Grid container justify="center">
                <Grid item xs={6}>
                    <Paper className={classes.paper} align="center">
                        <Avatar className={classes.avatar} src={avatar} />
                        <input
                            accept="image/*"
                            className={classes.fileInput}
                            id="avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                        />
                        <label htmlFor="avatar-upload">
                            <Button variant="outlined" color="primary" component="span">
                                点击修改头像
                            </Button>
                        </label>
                        <TextField
                            className={classes.textField}
                            label="姓名"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                        <RadioGroup
                            className={classes.textField}
                            aria-label="性别"
                            name="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            row
                        >
                            <FormControlLabel value="male" control={<Radio color="primary" />} label="男" />
                            <FormControlLabel value="female" control={<Radio color="primary" />} label="女" />
                        </RadioGroup>
                        <TextField
                            className={classes.textField}
                            label="邮箱"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            className={classes.textField}
                            label="电话"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            className={classes.textField}
                            label="已绑定MetaMask钱包地址"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            fullWidth
                        />
                        {/*<TextField*/}
                        {/*    className={classes.textField}*/}
                        {/*    label="个人描述"*/}
                        {/*    value={bio}*/}
                        {/*    onChange={(e) => setBio(e.target.value)}*/}
                        {/*    multiline*/}
                        {/*    rows={4}*/}
                        {/*    fullWidth*/}
                        {/*/>*/}
                        <Button variant="outlined" color="primary" onClick={handleSave} style={{ padding: 5,marginLeft: '3em',  marginRight: '6em'  }}>
                            编辑个人信息
                        </Button>
                        <Button variant="outlined" color="primary" onClick={handleSave}>
                            保存
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfilePage;

import React, {useState,useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {useStyles} from './styles.js'

import logo from '../../assets/logo.png';
import { ex } from "../../common/global.js";
const Header = (props) => {
    const classes = useStyles();
    const nft = useSelector((state) => state.allNft.nft);
    const account = useSelector((state) => state.allNft.account);
    // const nftItem = useSelector((state) => state.allNft.nft);
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const {
        image,
        name,
        price,
        owner,
        creator,
        description,
        tokenId,
        saleId,
        isForSale,
        isSold,
    } = nft;
    

    const [keyword, setKeyword] = useState({
        receive : "",
    });

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const dispatch = useDispatch();
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);


    async function onSubmit (event){
        event.preventDefault();
        console.log("gotta submit ：", keyword.receive);
        // alert("gotta submit ："+keyword.receive);
    };
    // const onChange = value =>{
    //     setKeyword(value);
    // }
    function onChange(event) {
        let value = event.target.value;
        let newData = {};
        newData.receive = value;
        setKeyword(newData);

    }
    useEffect(() => {
        console.log("keyword:"+keyword.receive);
        let filterByName=(nft,name)=>{
            return nft.filter(function(item) {
                return item.name.indexOf(keyword.receive) >= 0 ;
            });
        }
        console.log(filterByName(nft,name));
    },[keyword]);

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar className={classes.header}>
                <Toolbar>
                    <Link to="/">
                        <img src={logo} alt="shsxy" className={classes.logo}/>
                    </Link>
                    <div className={classes.root}>
                        <Link to="/Login">
                            <Button href="#" size="large" className={classes.button0}>
                                登录
                            </Button>
                        </Link>
                        <Link to="/create-nft">
                            <Button href="#" size="large" className={classes.button0}>
                                创作NFT
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button href="#" size="large" className={classes.button1}>
                                NFT要闻
                            </Button>
                        </Link>
                        <Link to="/product">
                            <Button href="#" size="large" className={classes.button2}>
                                NFT产品
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button href="#" size="large" className={classes.button3}>
                                积分兑换
                            </Button>
                        </Link>
                    </div>
                    <div className={classes.account2}>
                        <Link to="/UserSetting">
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={classes.account}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                            >
                                <AccountCircle fontSize="large"/>
                            </IconButton>
                        </Link>
                    </div>
                    <div className={classes.account}>
                        <AccountBalanceWalletIcon
                            fontSize="large"
                            color="action"
                            titleAccess="Wallet Address" className={classes.walletIcon}/>
                        <Typography variant="h6"
                                    color="textPrimary">{account.slice(0, 7)}...{account.slice(-4)}</Typography>
                    </div>
            </Toolbar>
        </AppBar>

        </React.Fragment>
    );
};

export default Header;



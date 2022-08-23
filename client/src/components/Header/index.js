import React, {useState, useEffect} from "react";
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

import logo from '../../assets/shsxy.svg';
import Grid from "@material-ui/core/Grid";
import Card from "../Card";
const Header = () => {
    const classes = useStyles();
    const account = useSelector((state) => state.allNft.account);
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [keyword, setKeyword] = useState({
        receive: "",
    });
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const nft = useSelector((state) => state.allNft.nft);
    const nftItem = useSelector((state) => state.allNft.nft);
    //const name = useSelector((state) => state.allNft.name);
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
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar className={classes.header}>
                <Toolbar>
                    <Link to="/">
                        <img src={logo} alt="shsxy" className={classes.logo}/>
                    </Link>
                    <div className={classes.root}>
                        <div>
                            <Link to="/classify">
                                <Button variant="contained" color="primary" disableElevation>
                                    分类
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="contained" color="primary" disableElevation>
                                    账号登录/注册
                                </Button>
                            </Link>
                            <Button
                                variant="contained" color="primary"
                                ref={anchorRef}
                                aria-controls={open ? 'menu-list-grow' : undefined}
                                aria-haspopup="true"
                                onClick={handleToggle}
                            >
                                Menu
                            </Button>
                            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                    <Link to="/create-nft">
                                                        <MenuItem onClick={handleClose}>创建NFT</MenuItem>
                                                    </Link>
                                                    <Link to="/my-nft">
                                                        <MenuItem onClick={handleClose}>我的NFT</MenuItem>
                                                    </Link>
                                                </MenuList>
                                            </ClickAwayListener>

                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                    </div>
                    <div>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={classes.account}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                    <div className={classes.account}>
                        <AccountBalanceWalletIcon titleAccess="Wallet Address" className={classes.walletIcon}/>
                        <Typography variant="subtitle1">{account.slice(0,7)}...{account.slice(-4)}</Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </React.Fragment>
    );
};

export default Header;


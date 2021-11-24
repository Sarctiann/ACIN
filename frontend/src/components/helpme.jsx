import React from "react";
import { Tabs, Tab, Popover, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const styles = {
  Tab: {
    flexDirection: "row-reverse"
  }
};

class TabDemo extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "One",
      label: "Three",
      content: "One",
      anchorEl: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  handleClick(event) {
    event.stopPropagation();
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null
    });
  }

  handleMenuItemClick(menuItem) {
    this.handleClose();
    this.setState({
      label: menuItem,
      content: menuItem,
      value: "More"
    });
  }

  render() {
    const { value } = this.state;
    const open = Boolean(this.state.anchorEl);
    const { classes } = this.props;

    return (
      <>
        <Tabs
          value={value}
          indicatorColor="primary"
          onChange={this.handleChange}
        >
          <Tab
            value="One"
            label="One"
            onClick={() => this.setState({ content: "One" })}
          />
          <Tab
            value="Two"
            label="Two"
            onClick={() => this.setState({ content: "Two" })}
          />
          <Tab
            classes={{ wrapper: classes.Tab }}
            value="More"
            label={this.state.label}
            icon={<ArrowDropDownIcon onClick={this.handleClick} />}
            onClick={() => this.setState({ content: this.state.label })}
          />
        </Tabs>
        {this.state.content}

        <Popover
          open={open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <MenuItem onClick={() => this.handleMenuItemClick("Three")}>
            Three
          </MenuItem>
          <MenuItem onClick={() => this.handleMenuItemClick("Four")}>
            Four
          </MenuItem>
          <MenuItem onClick={() => this.handleMenuItemClick("Five")}>
            Five
          </MenuItem>
        </Popover>
      </>
    );
  }
}

export default withStyles(styles)(TabDemo);
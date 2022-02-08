import { makeStyles } from "@mui/styles";

export const sxButton = {
    border: "4px solid black",
    borderRadius: "15px",
    color: "black",
    fontFamily: "Myriad Pro",
    padding: "15px",
    backgroundColor: "white",
    fontSize: "0.7vmax",
    '&:hover': {
        backgroundColor: '#D5D5D5',
        color: '#000000',
    },
}

export const styleStack = makeStyles({
    root: {
        justifyContent: "center",
        alignItems: "center",
    }
})

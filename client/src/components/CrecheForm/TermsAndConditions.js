import * as React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function TermsAndConditions() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography sx={{ mx: 2, mt: 1 }}>
        {" "}
        By adding your creche, you are agreeing to the{" "}
        <Link size="small" variant="text" onClick={handleClickOpen}>
          Terms and Conditions
        </Link>
        .
      </Typography>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"lg"}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Terms and Conditions
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            By contributing your creche or nativity sets ("creches") to our
            event, you are entering into a mutual agreement governed by these
            Terms and Conditions. It is vital to understand that, during the
            course of our event, your creches may be displayed and utilized over
            several weeks as part of our showcase. While many measures will be
            taken to ensure the protection and safety of your creches, it is
            important to acknowledge that unforeseen circumstances may lead to
            potential damage or wear and tear over the course of their use. The
            act of contributing your creches implies your acceptance of these
            potential risks.
          </Typography>
          <Typography gutterBottom>
            We value your contribution to our event. Your consent to these Terms
            and Conditions allows us to use and showcase your creches as
            integral elements of our event over an extended duration. We assure
            you that your creches will be treated with the utmost respect and
            care. However, it is essential to recognize that events involving
            valuable items inherently carry certain risks. To address these
            risks, we recommend considering supplementary coverage or insurance,
            as necessary, to protect your valuable possessions. In the unlikely
            event of any damage or loss, we cannot be held liable, and any
            coverage for such losses will be the contributor's responsibility.
          </Typography>
          <Typography gutterBottom>
            In consideration of your creche contribution, you agree to indemnify
            and hold harmless our organization, its members, volunteers, and
            affiliated entities from any claims, liabilities, damages, or losses
            related to the use of your creches during the event. By contributing
            your creches, you release our organization from any and all
            responsibilities or liabilities associated with their display and
            use. It is your responsibility to ensure adequate protection,
            insurance, or coverage for your creches. By continuing with the
            contribution process, you confirm your understanding and acceptance
            of these Terms and Conditions, acknowledging the potential risks and
            absolving our organization of any responsibility for damage, loss,
            or any other related issues.
          </Typography>
          <Typography gutterBottom>
            The Title you provide for the creche and its Origin will be on
            display during the showcase. The image you provide along with the
            description will be available online only and will not be printed
            for the event. We thank you again for your contribution.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

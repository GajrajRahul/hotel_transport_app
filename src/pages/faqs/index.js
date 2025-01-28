import React, { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Container, Grid, Box } from '@mui/material'
import { CloseMinusIcon, ExpandPlusIcon } from 'src/utils/icons'
import { useTheme } from '@mui/material/styles'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router';


const faqsData = [
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click on the "Forgot Password?" link on the login page, enter your registered email address, and follow the instructions in the password reset email to create a new password.'
  },
  {
    question: 'The password reset link has expired. What now?',
    answer: 'Password reset links usually expire after 30 minutes to an hour. Request a new reset email and follow the new link.'
  },
  {
    question: 'I didn’t receive the password reset email. What should I do?',
    answer: 'Check your spam/junk folder. If it’s not there, ensure you entered the correct email address and try requesting the reset again. Sometimes, email delays can happen, so please wait up to 15 minutes. If you still don’t receive it, contact support.'
  },
  
  {
    question: 'I followed the reset instructions, but it didn’t work. What should I do?',
    answer: 'Ensure that you’re entering the correct new password (including case sensitivity). Also, check if your new password meets the required criteria, such as a minimum number of characters or the inclusion of special characters. If the issue persists, try resetting it again.'
  },
  {
    question: 'Why is my account locked after multiple failed login attempts?',
    answer: 'For security reasons, after several unsuccessful login attempts, your account may be temporarily locked. You should be able to reset your password or contact customer support for assistance.'
  },
  {
    question: 'I entered my email, but I’m getting an error saying it’s not recognized.',
    answer: `Double-check that you're using the correct email address associated with your account. If you're sure it's correct and still can't log in, try reaching out to support for help.`
  },
  {
    question: 'I reset my password, but I still can’t log in.',
    answer: `Make sure you’re entering the correct, updated password. If you’re still having trouble, it might help to clear your browser cache or try a different browser.`
  },
  {
    question: `I can't log in using my browser. What’s going on?`,
    answer: `Try clearing your browser’s cache and cookies, or open the site in an incognito/private browsing window. If you're still having issues, try using a different browser or device to log in.`
  },
  {
    question: 'The password reset link redirects me to the wrong page or an error message.',
    answer: `This could be due to a session issue. Try clearing your browser cookies or open the link in an incognito/private browsing window.`
  },
  {
    question: 'I’m sure my password is correct, but I can’t log in. What should I do?',
    answer: `If you’re sure your password is correct but still can't log in, try resetting it by clicking the "Forgot Password?" link. If you recently changed your password and can’t remember the new one, follow the reset steps.`
  },
  {
    question: `I can't log in using my browser. What’s going on?`,
    answer: `Try clearing your browser’s cache and cookies, or open the site in an incognito/private browsing window. If you're still having issues, try using a different browser or device to log in.`
  },
  {
    question: 'Why is my account locked?',
    answer: `After several unsuccessful login attempts, your account may be temporarily locked for security reasons. Wait for a set amount of time (usually 15-30 minutes) before trying again, or reset your password if you believe you've forgotten it.`
  },
  {
    question: `I signed up, but I can't log in. Why?`,
    answer: `After you sign up, your account is sent to an admin for approval. Once the admin approves your account, you’ll receive an email notification confirming that you can log in. Please check your inbox (and spam folder) for the approval email. If you haven't received it yet, the admin may still be reviewing your request.`
  },
  {
    question: `What is the process after I sign up for an account?`,
    answer: `Once you complete the sign-up form, your request is sent to our admin team for approval. After they review and approve your account, you’ll receive a confirmation email letting you know you can log in. Please note that this process may take a little time depending on the admin’s availability.`
  },
  {
    question: `How long will it take for my account to be approved?`,
    answer: `The approval time varies based on the admin’s workload. Typically, it takes [insert time frame, e.g., 1–2 business days] for approval. If you haven’t received an email after this period, please contact support for assistance.`
  },
  {
    question: `I signed up but haven’t received an approval email. What should I do?`,
    answer: `First, check your spam or junk folder to ensure the email wasn’t misdirected. If you still don’t see it, try contacting our support team to check the status of your approval. They can assist you with any issues.`
  },
  {
    question: `Why was my account request rejected?`,
    answer: `If your account was rejected by the admin, you should have received a notification with the reason. This could be due to missing information or other criteria. If you believe there was a mistake, please contact support for clarification or assistance with reapplying.
`
  },
  {
    question: `How can I tell if my account has been approved?`,
    answer: `Once your account is approved, you’ll receive an email notification confirming that you can log in. If you haven’t received an approval email after signing up, your account is still pending review by the admin.`
  },
  {
    question: `How long will it take for my account to be approved?`,
    answer: `The approval time varies based on the admin’s workload. Typically, it takes [insert time frame, e.g., 1–2 business days] for approval. If you haven’t received an email after this period, please contact support for assistance.`
  },
  {
    question: `How long will it take for my account to be approved?`,
    answer: `The approval time varies based on the admin’s workload. Typically, it takes [insert time frame, e.g., 1–2 business days] for approval. If you haven’t received an email after this period, please contact support for assistance.`
  }

]

const FAQItem = ({ faq }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary
        expandIcon={expanded ? CloseMinusIcon : ExpandPlusIcon}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography variant='h6'>{faq.question}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{faq.answer}</Typography>
      </AccordionDetails>
    </Accordion>
  )
}

const FAQsPage = () => {
    const router = useRouter(); 
  

  const handleFaqClick = () => {
    // Redirect to the FAQ page
    router.push('/login'); // Make sure to replace '/faq' with your actual FAQ route
  };

  const theme = useTheme()
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '40px' }}
    >
       <Box
      sx={{
        borderRadius: '30px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: { xs: 'center', sm: 'space-between' },
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' }, // Column on mobile, row on larger screens
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: { xs: '20px', sm: '40px' }, // Padding for mobile and larger screens
      }}
    >
      <Grid container direction="column" spacing={2} sx={{ gap: '20px'}}>
        <Grid item>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              textAlign: { xs: 'center', sm: 'left' }, // Centered on mobile, left-aligned on desktop
            }}
          >
            Frequently Asked Questions
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: theme.palette.text.secondary,
              textAlign: { xs: 'center', sm: 'left' }, // Centered on mobile, left-aligned on desktop
            }}
          >
           Here, you'll find answers to frequently asked questions about login issues, and profile-related concerns. If you need further assistance, feel free to reach out to our support team.
          </Typography>
        </Grid>

        <Grid item sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: '10px 20px',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              borderRadius: '8px',
              marginTop: theme.spacing(2),
              textAlign: { xs: 'center', sm: 'left' }
            }}
            onClick={handleFaqClick}
          >
           Go to Login
          </Button>
        </Grid>
      </Grid>

      <img
        src="/images/faqs.jpg"
        alt="FAQ Banner"
        style={{
          width: '100%',
          maxWidth: '500px', // Limit the image width on large screens
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '30px',
          marginTop: { xs: '20px', sm: '0' }, // Margin top for smaller screens
        }}
      />
    </Box>

      <Container sx={{ my: 4 }}>
        <Grid container spacing={4}>
          {faqsData.map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FAQItem faq={faq} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box py={8} textAlign='center'>
        <Typography variant='h4' gutterBottom>
          Have more questions?
        </Typography>
        <Typography paragraph>
          Our support team is ready to help you. Feel free to get in touch with us via our contact page.
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() =>
            window.open(
              'https://wa.me/+919784189197?text=kindly%20describe%20your%20issue%20before%20starting%20the%20chat%20with%20our%20ARH%20support%20experts.%20Your%20details%20will%20help%20us%20assist%20you%20more%20efficiently!',
              '_blank'
            )
          }
        >
          Chat With Us
        </Button>
      </Box>
    </Box>
  )
}

FAQsPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
FAQsPage.guestGuard = true

export default FAQsPage

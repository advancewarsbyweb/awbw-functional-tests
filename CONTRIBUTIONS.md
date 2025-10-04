## Open Source Contribution Guide

If you want to contribute to the open source tests, you are more than welcome!

# How do I contribute?

To contribute, we use the common Fork build -> PR method. Please fork the project, and make a PR against this
project from your fork! An AWBW dev will review it, and merge it in if it looks good. Don't be disheartened 
if there are PR comments!

Right now, we are automating against production, since it's easy for the AWBW to just point the test automation at
their local, run the same tests, and see if they pass.

You will have to make your own test account in `cypress/fixtures/personal-automation-account.json` in order to run the
tests. Please use a throwaway test account instead of an account you care about, and never assume this account is secure.

You are also welcome to comment on any PRs that you see, and help others write quality code!

All skill levels are welcome to contribute!

---
# **_NEVER USE A PERSONAL ACCOUNT FOR AWBW TEST AUTOMATION._ EVER. IF YOU CARE ABOUT AN ACCOUNT, DO NOT USE IT.**


# THIS IS TO KEEP YOU FROM ACCIDENTALLY DOING SOMETHING YOU WILL REGRET, LIKE INCLUDING A PASSWORD IN A PR.

---

# Why Cypress?

Cypress is relatively easy for beginners to contribute to, and in general it is easier to write reliable E2E tests due
to built in polling mechanisms in the commands, and the nice friendly way to create automated tests.

We understand that the majority of people that contribute might enjoy development as a casual hobby, so the idea is to
make the tests easy for the majority of hobbyists to add.

# What can I contribute?

Right now, we are seeking to expend the test automation suite with a _LOT_ of AWBW tests. The site is a 20 year old
college project held together by sticks, duct tape, and glue! If you need ideas for what to work on to help out, 
feel free to check out the issues in Github!

# What is required to merge my code?

- Make sure there aren't any merge conflicts!

- Make sure all tests pass when you run `npx cypress run`. Run this multiple times to make sure the tests you made
aren't flakey!

- Make a PR from your fork branch to the project, and wait for an AWBW developer to be able to take a look!

- If you want to make your PR easy to merge, please keep the PRs somewhat small. It's OK and encouraged to break large 
amounts of code into smaller chunks. 

# AI Policy

AI generated code is fine! However, note that AI generated comments in PRs, issues, and bug reports that are
generated without your own input or manual review are NOT fine, and will result in you being banned from the open 
source repo. We understand that you might be trying to be helpful, but when implemented poorly, it is often less helpful
and more _very_ annoying!

In general, it is fine to use a very powerful, very fun tool! You can even have fun with agents! Just know that we will
not be happy with a lot of AI spam from someone who doesn't want to engage with their toolset!

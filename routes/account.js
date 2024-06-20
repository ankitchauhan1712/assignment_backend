const express = require('express');
const Account = require('../models/Account');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/auth');
const router = express.Router();

// Create Account
router.post('/', async (req, res) => {
    try {      
        const { first_name, last_name, email, phone, password, birthday } = req.body;

           // Input validation
           if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const account = await Account.create({
            first_name,
            last_name,
            email,
            phone,
            password: hashedPassword,
            birthday,
        });
        console.log(account);
        res.status(201).json(account);
    } catch (error) {
        console.log("ERROR");
        res.status(400).json({ error: error.message });
    }
});

// Read Account
router.get('/:id', authenticate, async (req, res) => {
    try {
        const account = await Account.findByPk(req.params.id);
        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Account
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, birthday } = req.body;
        const account = await Account.findByPk(req.params.id);
        if (account) {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : account.password;
            await account.update({
                first_name,
                last_name,
                email,
                phone,
                password: hashedPassword,
                birthday,
                last_modified: new Date(),
            });
            res.json(account);
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Account
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const account = await Account.findByPk(req.params.id);
        if (account) {
            await account.destroy();
            res.status(204).send(' Deleted Successfully ');
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// List Accounts with limitation
router.get('/', authenticate, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const accounts = await Account.findAll({ limit });
        res.json(accounts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

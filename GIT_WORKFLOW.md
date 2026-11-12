# Git Workflow for PrintPoint Centre

The project is developed by a six‑person student team (members 1‑6).  Each member works only on *their own* files and creates a dedicated branch.  The steps below describe how to set up the repo, create branches, stage the correct files, commit, push, and open a Pull Request (PR).

---

## 1️⃣ Initial Repository Setup (run once by the team lead)
```powershell
# From any location you want the repo to live
cd "C:\BEF GA"
git clone <YOUR_REPO_URL> PrintPoint-Centre   # or create a new repo on GitHub first
cd PrintPoint-Centre

# Install dependencies (network required) – already done earlier
npm install

# Create the initial scaffold commit (contains only the project skeleton)
git add .gitignore package.json server.js database/ routes/ controllers/ middleware/ tests/ docs/ postman/
git commit -m "initial scaffold – project structure and core code"
git push -u origin main
```

---

## 2️⃣ Individual Member Workflow
Each member repeats the following steps on **their own machine**.  Replace `memberX` with the appropriate identifier (e.g., `member1`, `member2`).

### 2.1 Create a personal branch
```powershell
# Make sure you are on the latest main
git checkout main
git pull

# Create and switch to your branch
git checkout -b memberX-<feature>
```
> **Naming convention:** `member<number>-<short‑description>` (e.g., `member3-printer-api`).

### 2.2 Stage **only** the files you own
| Member | Files you should stage |
|-------|------------------------|
| **1** (Server) | `server.js` |
| **2** (Database) | `database/schema.sql`, `database/database.js`, `database/seed.js` |
| **3** (Printers API) | `routes/printerRoutes.js`, `controllers/printerController.js` |
| **4** (Designers & Reservations API) | `routes/designerRoutes.js`, `controllers/designerController.js`, `routes/reservationRoutes.js`, `controllers/reservationController.js` |
| **5** (Validation & Errors) | `middleware/validators.js`, `middleware/errorHandler.js` |
| **6** (Docs, Postman, Git workflow) | `README.md`, `docs/VIVA_CHEATSHEET.md`, `docs/DEMO_SCRIPT.md`, `postman/PrintPoint-Collection.json`, `GIT_WORKFLOW.md` |

Example for Member 3:
```powershell
git add routes/printerRoutes.js controllers/printerController.js
```

### 2.3 Commit with a meaningful message
```powershell
git commit -m "Member 3 – add printer routes and controller"
```

### 2.4 Push the branch to GitHub
```powershell
git push -u origin memberX-<feature>
```

### 2.5 Open a Pull Request
1. Go to the repository page on GitHub.
2. You’ll see a banner offering to create a PR from your newly‑pushed branch – click **Compare & pull request**.
3. Give the PR a clear title (e.g., *"Member 3 – printer CRUD endpoints"*).
4. Add a short description of what was changed.
5. Assign a reviewer (any other team member) and request a review.
6. After approval, click **Merge pull request** → **Confirm merge**.

---

## 3️⃣ After Merging
```powershell
# Switch back to main and pull the merged changes
git checkout main
git pull
```
You can now repeat the workflow for the next member.

---

## 4️⃣ Fresh‑Clone Verification (to show the repo builds from scratch)
```powershell
# In a separate folder (or after deleting the current copy)
cd "C:\BEF GA"
git clone <YOUR_REPO_URL> fresh-clone
cd fresh-clone
npm install
npm run seed   # optional – loads sample data
npm start        # should start without errors
npm test         # all tests must pass
```
If everything works, the repository is ready for submission.

---

**Remember:** Do **not** commit changes to files owned by another member.  If you need to edit a shared file (e.g., `README.md`), coordinate with the owner or create a separate *documentation* branch.


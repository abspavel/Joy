const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePortfolioData.ts', 'utf8');

code = code.replace(
    `} catch (err: any) {
      if (err.message === 'TIMEOUT') {
        setTimedOut(true);
      } else {
        setError(err);
      }
    } finally {`,
    `} catch (err: any) {
      delete pendingRequests[tableName]; // Clear so it can retry on next mount
      if (err.message === 'TIMEOUT') {
        setTimedOut(true);
      } else {
        setError(err);
      }
    } finally {`
);

fs.writeFileSync('src/hooks/usePortfolioData.ts', code);

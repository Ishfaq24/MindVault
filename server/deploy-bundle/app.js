/**
 * MindVault Backend Entry Point for cPanel / Phusion Passenger
 *
 * cPanel's Node.js application manager expects an application startup file
 * in the root directory of the application. This file launches the compiled
 * production build in `./build/index.js`.
 */

import "./build/index.js";

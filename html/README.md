# Apt-ID Interactive Prototype

## Overview

This repository contains an interactive prototype for the Apt-ID system, a decentralized profile solution built on the Aptos blockchain. The prototype, designed for the May Hackathon, demonstrates how developers can create, customize, and deploy blockchain-based user profiles with resource-efficient storage using Aptos resource groups.

## Features

### Core Functionality
- **Interactive Move Contract Editor**: Edit Move smart contracts in real-time with syntax highlighting
- **Live Profile Preview**: See how your changes affect the profile UI immediately
- **Resource Visualization**: Compare traditional storage vs. resource group storage efficiency
- **Deployment Simulation**: Experience the deployment process without actual blockchain interaction

### Technical Demonstrations
- Resource group storage optimization (showing cost savings)
- Custom profile field addition and management
- Link type customization for social connections
- Move contract structural patterns for efficient data organization

## How to Use

1. Open `apt-id-prototype.html` in any modern web browser
2. Explore the Move contract in the editor panel on the left
3. Use the modification templates in the bottom panel to:
   - Add custom profile fields
   - Add new link types
   - Add functions to interact with profile data
4. Watch the profile preview update in real-time
5. Test your changes in the simulation environment
6. Experience the simulated deployment process

## Technical Details

### Move Contract Structure
The prototype demonstrates a Move contract with:
- Resource group members for efficient on-chain storage
- Modular profile components (Bio, LinkTree, ProfileRef)
- Customizable fields and extensible architecture
- Object-capable design for modern Aptos development

### User Interface Components
- **Contract Editor**: Monaco-based editor with Move syntax highlighting
- **Profile Preview**: Real-time visual representation of profile changes
- **Storage Visualization**: Comparative view of storage approaches
- **Deployment Panel**: Step-by-step deployment simulation
- **Learning Progress Tracker**: Guided pathway through key concepts

### Storage Optimization Showcase
The visualization panel demonstrates how Aptos resource groups can reduce storage costs by up to 65% compared to traditional storage methods, showing:
- Individual resource storage allocation (traditional)
- Grouped resource storage allocation (optimized)
- Associated cost comparisons

## Educational Value
This prototype serves as a learning tool for:
- Understanding Move contract structure and syntax
- Visualizing blockchain storage optimizations
- Experiencing the development workflow for blockchain applications
- Exploring the benefits of resource grouping in Aptos

## Future Enhancements
Potential improvements that could be implemented:
- Integration with an actual Aptos wallet for live deployments
- Expanded template library for common profile patterns
- Additional visualizations for gas costs and execution flows
- Multi-user profile viewing capabilities

## Acknowledgments
- Aptos Labs for the blockchain infrastructure
- Monaco Editor for the code editing capabilities
- May Hackathon organizers and participants

---

*This prototype is intended for educational and demonstration purposes only.*
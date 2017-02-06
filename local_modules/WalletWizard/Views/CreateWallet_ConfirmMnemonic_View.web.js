// Copyright (c) 2014-2017, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
"use strict"
//
const commonComponents_forms = require('../../WalletAppCommonComponents/forms.web')
const commonComponents_navigationBarButtons = require('../../WalletAppCommonComponents/navigationBarButtons.web')
const commonComponents_walletMnemonicBox = require('../../WalletAppCommonComponents/walletMnemonicBox.web')
//
const AddWallet_Wizard_ScreenBaseView = require('./AddWallet_Wizard_ScreenBaseView.web')
//
class CreateWallet_ConfirmMnemonic_View extends AddWallet_Wizard_ScreenBaseView
{
	_setup_views()
	{
		const self = this
		super._setup_views()
		const walletInstance = self.wizardController.walletInstance
		const generatedOnInit_walletDescription = walletInstance.generatedOnInit_walletDescription
		const mnemonicString = generatedOnInit_walletDescription.mnemonicString
		self.mnemonicString = mnemonicString
		const correctlyOrdered_mnemonicString_words = self.mnemonicString.split(" ")
		self.numberOf_mnemonicString_words = correctlyOrdered_mnemonicString_words.length // cached
		{
			const text = "Verify your mnemonic"
			const layer = self._new_messages_subheaderLayer(text)
			layer.style.marginTop = "36px"
			layer.style.textAlign = "center"
			layer.style.wordBreak = "break-word"
			self.layer.appendChild(layer)
		}
		{
			const text = "Choose each word in the correct&nbsp;order."
			const layer = self._new_messages_paragraphLayer(text)
			layer.style.marginBottom = "39px" // not 40 to leave 1px for clear border
			layer.style.textAlign = "center"
			layer.style.wordBreak = "break-word"
			self.layer.appendChild(layer)
		}
		{
			const view = commonComponents_walletMnemonicBox.New_MnemonicConfirmation_SelectedWordsView(
				self.mnemonicString, 
				self.context,
				function(word)
				{ // did select word
					self._configureInteractivityOfNextButton()
				},
				function(word)
				{ // did deselect word
					self._configureInteractivityOfNextButton()
				}
			)
			self.mnemonicConfirmation_selectedWordsView = view
			self.layer.appendChild(view.layer)
		}
		{
			const view = commonComponents_walletMnemonicBox.New_MnemonicConfirmation_SelectableWordsView(
				self.mnemonicString, 
				self.mnemonicConfirmation_selectedWordsView, 
				self.context
			)
			self.mnemonicConfirmation_selectableWordsView = view
			self.addSubview(view)
		}
		self.mnemonicConfirmation_selectedWordsView.Component_ConfigureWith_selectableWordsView(
			self.mnemonicConfirmation_selectableWordsView
		)
		{
			const layer = document.createElement("div")
			layer.style.fontSize = "11px"
			layer.style.fontFamily = self.context.themeController.FontFamily_monospace()
			layer.style.fontSize = "11px"
			layer.style.lineHeight = "14px"
			layer.style.color = "#f97777"
			layer.style.width = "267px"
			layer.style.margin = "4px auto 0 auto"
			layer.style.display = "none"
			layer.style.wordBreak = "break-word"
			layer.innerHTML = "That’s not right. You can try again or start over with a new mnemonic."
			self.mnemonicConfirmation_validationErrorLabelLayer = layer
			self.layer.appendChild(layer)
		}
	}
	_setup_startObserving()
	{
		const self = this
		super._setup_startObserving()
	}
	//
	//
	// Lifecycle - Teardown
	//
	TearDown()
	{
		const self = this
		super.TearDown()
		//
		self.mnemonicConfirmation_selectableWordsView.TearDown()
		self.mnemonicConfirmation_selectedWordsView.TearDown()
	}
	//
	//
	// Runtime - Accessors - Factories
	//
	_new_messages_subheaderLayer(contentString)
	{
		const self = this
		const layer = document.createElement("h3")
		layer.innerHTML = contentString
		layer.style.fontFamily = self.context.themeController.FontFamily_sansSerif()
		layer.style.fontSize = "13px"
		layer.style.lineHeight = "20px"
		layer.style.fontWeight = "500"
		layer.style.color = "#F8F7F8"
		layer.style.marginTop = "24px"
		layer.style.textAlign = "center"
		return layer
	}
	_new_messages_paragraphLayer(contentString)
	{
		const self = this
		const layer = document.createElement("p")
		layer.innerHTML = contentString
		layer.style.fontFamily = self.context.themeController.FontFamily_sansSerif()
		layer.style.fontWeight = "normal"
		layer.style.fontSize = "13px"
		layer.style.color = "#8D8B8D"
		layer.style.lineHeight = "20px"
		return layer
	}
	//
	//
	// Runtime - Accessors - Navigation
	//
	Navigation_Title()
	{
		return "New Wallet"
	}
	Navigation_New_RightBarButtonView()
	{
		const self = this
		const view = commonComponents_navigationBarButtons.New_RightSide_SaveButtonView(self.context)
		self.rightBarButtonView = view
		const layer = view.layer
		layer.innerHTML = "Confirm"
		layer.addEventListener(
			"click",
			function(e)
			{
				e.preventDefault()
				{
					if (self.isSubmitButtonDisabled !== true) { // button is enabled
						self._userSelectedNextButton()
					}
				}
				return false
			}
		)
		self._configureInteractivityOfNextButton() // will be disabled on first push - but not necessarily on hitting Back
		return view
	}
	//
	//
	// Runtime - Accessors - Mnemonic validation
	//
	_hasUserEnteredCorrectlyOrderedMnemonic()
	{
		const self = this
		const selected_mnemonicWords = self.mnemonicConfirmation_selectedWordsView.Component_SelectedWords
		const selected_mnemonicString = selected_mnemonicWords.join(" ").toLowerCase()
		if (selected_mnemonicString === self.mnemonicString) {
			return true
		}
		return false
	}	
	//
	//
	// Runtime - Imperatives - Submit button enabled state
	//
	_configureInteractivityOfNextButton()
	{
		const self = this
		const view = self.mnemonicConfirmation_selectedWordsView
		if (typeof view === 'undefined' || !view) {
			console.warn("_configureInteractivityOfNextButton called while self.mnemonicConfirmation_selectedWordsView nil")
			self.disable_submitButton()
			return
		}
		const selectedWords = view.Component_SelectedWords
		if (selectedWords.length === self.numberOf_mnemonicString_words) {
			self.enable_submitButton()
		} else {
			self.disable_submitButton()
		}
	}
	disable_submitButton()
	{
		const self = this
		if (self.isSubmitButtonDisabled !== true) {
			self.isSubmitButtonDisabled = true
			const buttonLayer = self.rightBarButtonView.layer
			buttonLayer.style.opacity = "0.5"
		}
	}
	enable_submitButton()
	{
		const self = this
		if (self.isSubmitButtonDisabled !== false) {
			self.isSubmitButtonDisabled = false
			const buttonLayer = self.rightBarButtonView.layer
			buttonLayer.style.opacity = "1.0"
		}
	}
	//
	//
	// Runtime - Delegation - Interactions
	//
	_userSelectedNextButton()
	{
		const self = this 
		if (self._hasUserEnteredCorrectlyOrderedMnemonic() == false) {
			self.mnemonicConfirmation_selectedWordsView.layer.classList.add("errored")
			self.disable_submitButton()
			self.mnemonicConfirmation_selectedWordsView.Component_SetEnabled(false)
			self.mnemonicConfirmation_selectableWordsView.layer.style.display = "none"
			self.mnemonicConfirmation_validationErrorLabelLayer.style.display = "block"
			// self.actionBarView.layer.display = "block"
			//
			return
		}
		
		self.navigationController.navigationBarView.leftBarButtonView.SetEnabled(false)
		self.disable_submitButton()
		//
		const walletInstance = self.wizardController.walletInstance
		if (!walletInstance) {
			throw "Missing expected walletInstance"
		}
		const walletLabel = self.wizardController.walletMeta_name
		const swatch = self.wizardController.walletMeta_colorHexString
		self.context.walletsListController.WhenBooted_BootAndAdd_NewlyGeneratedWallet(
			walletInstance,
			walletLabel,
			swatch,
			function(err, walletInstance)
			{
				if (err) {
					self.navigationController.navigationBarView.leftBarButtonView.SetEnabled(true)
					self.enable_submitButton()
					throw err
					return
				}
				self.wizardController.ProceedToNextStep() // this should lead to a dismiss of the wizard
			}
		)
	}
	//
	//
	// Runtime - Delegation - Navigation View special methods
	//
	navigationView_viewIsBeingPoppedFrom()
	{
		const self = this
		// I don't always get popped but when I do I maintain correct state
		self.wizardController.PatchToDifferentWizardTaskMode_withoutPushingScreen(
			self.options.wizardController_current_wizardTaskModeName, 
			self.options.wizardController_current_wizardTaskMode_stepIdx - 1
		)
	}
}
module.exports = CreateWallet_ConfirmMnemonic_View
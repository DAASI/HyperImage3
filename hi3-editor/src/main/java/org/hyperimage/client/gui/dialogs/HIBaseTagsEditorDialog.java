/*
 * Copyright 2014, 2015 bitGilde IT Solutions UG (haftungsbeschränkt)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.hyperimage.client.gui.dialogs;

import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.BorderFactory;
import javax.swing.DefaultComboBoxModel;
import javax.swing.GroupLayout;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.LayoutStyle;
import javax.swing.WindowConstants;
import javax.swing.border.TitledBorder;
import org.hyperimage.client.HIRuntime;
import org.hyperimage.client.Messages;
import org.hyperimage.client.exception.HIWebServiceException;
import org.hyperimage.client.gui.VisualTag;
import org.hyperimage.client.gui.lists.TagListCellRenderer;
import org.hyperimage.client.ws.HiGroup;

/**
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 */
public class HIBaseTagsEditorDialog extends JDialog implements ActionListener {

    private long baseID;
    private DefaultComboBoxModel tagListModel;
    private ArrayList<HiGroup> baseTags;
    
    /**
     * Creates a new HIBaseTagsEditorDialog
     * @param parent
     * @param item HyperImage base element
     */
    public HIBaseTagsEditorDialog(Frame parent, long baseID) {
        super(parent);
        
        try {
            HIRuntime.getGui().startIndicatingServiceActivity();
            baseTags = HIRuntime.getManager().getTagsForBaseElement(baseID);
            HIRuntime.getGui().stopIndicatingServiceActivity();
        } catch (HIWebServiceException wse) {
            HIRuntime.getGui().stopIndicatingServiceActivity();
            HIRuntime.getGui().reportError(wse, null);
            setVisible(false);
            return;
        }
        
        initComponents();
        updateLanguage();
        
        this.baseID = baseID;
        tagListModel = new DefaultComboBoxModel();
        tagListComboBox.setModel(tagListModel);
        tagListComboBox.setRenderer(new TagListCellRenderer());
        tagListComboBox.addActionListener(this);
        
        populateAvailableTagsList();
        
        
    }
    
    public void updateLanguage() {
        setTitle(Messages.getString("HIBaseTagsEditorDialog.title"));
        infoLabel.setText(Messages.getString("HIBaseTagsEditorDialog.note"));
        noTagsInfoLabel.setText(Messages.getString("HIBaseTagsEditorDialog.notags"));
    }
    
    private void populateAvailableTagsList() {
        try {
            List <HiGroup> projectTags = HIRuntime.getManager().getTags();
            if ( projectTags.size() > 0 ) 
                tagListModel.addElement(Messages.getString("HIBaseTagsEditorDialog.addtag"));
            else
                tagListModel.addElement(Messages.getString("HIBaseTagsEditorDialog.noprojecttags"));

            for ( HiGroup tag : projectTags ) {
                // check if tag is tag of element, if so add to tag panel instead of list
                boolean tagFound = false;
                for ( HiGroup bTag : baseTags ) if ( bTag.getId() == tag.getId() ) {
                    tagFound = true;
                    tagPanel.add(new VisualTag(tag, this));
                }
                if ( !tagFound ) tagListModel.addElement(tag);
            }
            tagListComboBox.setSelectedIndex(0);
            
            if ( tagPanel.getComponentCount() <= 1 ) noTagsInfoLabel.setVisible(true);
            else noTagsInfoLabel.setVisible(false);
            
        } catch (HIWebServiceException ex) {
            Logger.getLogger(HIBaseTagsEditorDialog.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public int chooseTags() {
        this.setLocationRelativeTo(HIRuntime.getGui());
        this.setVisible(true);
        return tagPanel.getComponentCount()-1;
    }


    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        editorPanel = new JPanel();
        tagListComboBox = new JComboBox();
        tagScroll = new JScrollPane();
        tagPanel = new JPanel();
        noTagsInfoLabel = new JLabel();
        infoLabel = new JLabel();

        setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        setTitle("Element Tags Bearbeiten");
        setModal(true);

        editorPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEtchedBorder(), "Tags", TitledBorder.DEFAULT_JUSTIFICATION, TitledBorder.DEFAULT_POSITION, new Font("Lucida Grande", 0, 13), Color.blue)); // NOI18N

        tagPanel.setPreferredSize(new Dimension(200, 22));

        noTagsInfoLabel.setText("- Keine Tags hinzugefügt -");
        tagPanel.add(noTagsInfoLabel);

        tagScroll.setViewportView(tagPanel);

        infoLabel.setText("Hinweis: Änderungen werden sofort gespeichert.");

        GroupLayout editorPanelLayout = new GroupLayout(editorPanel);
        editorPanel.setLayout(editorPanelLayout);
        editorPanelLayout.setHorizontalGroup(editorPanelLayout.createParallelGroup(GroupLayout.Alignment.LEADING)
            .addGroup(editorPanelLayout.createSequentialGroup()
                .addGroup(editorPanelLayout.createParallelGroup(GroupLayout.Alignment.LEADING)
                    .addGroup(editorPanelLayout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(editorPanelLayout.createParallelGroup(GroupLayout.Alignment.LEADING)
                            .addComponent(tagScroll)
                            .addComponent(infoLabel, GroupLayout.DEFAULT_SIZE, 318, Short.MAX_VALUE)))
                    .addComponent(tagListComboBox, 0, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        editorPanelLayout.setVerticalGroup(editorPanelLayout.createParallelGroup(GroupLayout.Alignment.LEADING)
            .addGroup(editorPanelLayout.createSequentialGroup()
                .addComponent(tagListComboBox, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(tagScroll, GroupLayout.DEFAULT_SIZE, 131, Short.MAX_VALUE)
                .addPreferredGap(LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(infoLabel)
                .addContainerGap())
        );

        GroupLayout layout = new GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
            .addGap(0, 342, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                .addComponent(editorPanel, GroupLayout.DEFAULT_SIZE, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
            .addGap(0, 217, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                .addComponent(editorPanel, GroupLayout.Alignment.TRAILING, GroupLayout.DEFAULT_SIZE, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    // Variables declaration - do not modify//GEN-BEGIN:variables
    JPanel editorPanel;
    JLabel infoLabel;
    JLabel noTagsInfoLabel;
    JComboBox tagListComboBox;
    JPanel tagPanel;
    JScrollPane tagScroll;
    // End of variables declaration//GEN-END:variables

    
    // ------------------------------------------------------------------------------------------------------

    
    @Override
    public void actionPerformed(ActionEvent e) {
        // user added a tag
        if ( e.getSource() == tagListComboBox && tagListComboBox.getSelectedIndex() > 0 ) {
            HiGroup tag = (HiGroup) tagListModel.getElementAt(tagListComboBox.getSelectedIndex());
            tagListComboBox.setSelectedIndex(0);
            // sync model with server
            boolean success;
            try {
                HIRuntime.getGui().startIndicatingServiceActivity();
                HIRuntime.getManager().addToGroup(baseID, tag.getId());
                HIRuntime.getGui().stopIndicatingServiceActivity();
                success = true;
            } catch (HIWebServiceException wse) {
                success = false;
                HIRuntime.getGui().stopIndicatingServiceActivity();
                HIRuntime.getGui().reportError(wse, null);
            }
            
            // update GUI
            if ( success ) {
                tagListModel.removeElement(tag);
                noTagsInfoLabel.setVisible(false);
                tagPanel.add(new VisualTag(tag, this));
            }
            
        }
        
        // user removed a tag
        if ( e.getSource().getClass() == JButton.class ) {
            HiGroup tag = ((VisualTag)((JButton)e.getSource()).getParent()).getModel();
            // sync model with server
            boolean success;
            try {
                HIRuntime.getGui().startIndicatingServiceActivity();
                HIRuntime.getManager().removeFromGroup(baseID, tag.getId());
                HIRuntime.getGui().stopIndicatingServiceActivity();
                success = true;
            } catch (HIWebServiceException wse) {
                success = false;
                HIRuntime.getGui().stopIndicatingServiceActivity();
                HIRuntime.getGui().reportError(wse, null);
            }

            // update GUI
            if ( success ) {
                tagPanel.remove(((JButton)e.getSource()).getParent());
                tagListModel.addElement(tag);
                if ( tagPanel.getComponentCount() <= 1 ) noTagsInfoLabel.setVisible(true);
                tagPanel.repaint();
            }
        }
        
    }

}

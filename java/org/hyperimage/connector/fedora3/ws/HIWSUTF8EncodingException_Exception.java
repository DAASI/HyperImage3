
package org.hyperimage.connector.fedora3.ws;

import javax.xml.ws.WebFault;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.3.1-hudson-749-SNAPSHOT
 * Generated source version: 2.1
 * 
 */
@WebFault(name = "HIWSUTF8EncodingException", targetNamespace = "http://fedora3.connector.hyperimage.org/")
public class HIWSUTF8EncodingException_Exception
    extends Exception
{

    /**
     * Java type that goes as soapenv:Fault detail element.
     * 
     */
    private HIWSUTF8EncodingException faultInfo;

    /**
     * 
     * @param message
     * @param faultInfo
     */
    public HIWSUTF8EncodingException_Exception(String message, HIWSUTF8EncodingException faultInfo) {
        super(message);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @param message
     * @param faultInfo
     * @param cause
     */
    public HIWSUTF8EncodingException_Exception(String message, HIWSUTF8EncodingException faultInfo, Throwable cause) {
        super(message, cause);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @return
     *     returns fault bean: org.hyperimage.connector.fedora3.ws.HIWSUTF8EncodingException
     */
    public HIWSUTF8EncodingException getFaultInfo() {
        return faultInfo;
    }

}


package org.hyperimage.connector.fedora3.ws;

import javax.xml.ws.WebFault;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.3.1-hudson-417-SNAPSHOT
 * Generated source version: 2.1
 * 
 */
@WebFault(name = "HIWSRuntimeException", targetNamespace = "http://connector.ws.hyperimage.org/")
public class HIWSRuntimeException_Exception
    extends Exception
{

    /**
     * Java type that goes as soapenv:Fault detail element.
     * 
     */
    private HIWSRuntimeException faultInfo;

    /**
     * 
     * @param faultInfo
     * @param message
     */
    public HIWSRuntimeException_Exception(String message, HIWSRuntimeException faultInfo) {
        super(message);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @param faultInfo
     * @param message
     * @param cause
     */
    public HIWSRuntimeException_Exception(String message, HIWSRuntimeException faultInfo, Throwable cause) {
        super(message, cause);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @return
     *     returns fault bean: org.hyperimage.connector.fedora3.ws.HIWSRuntimeException
     */
    public HIWSRuntimeException getFaultInfo() {
        return faultInfo;
    }

}
